import * as React from "react";
import flatten from "flat";
import invariant from "invariant";
import moment from "moment";
import { Field as BaseField, getIn, setIn } from "formik";
import { mapValues } from "lodash";

function mapInternalValues(value, fn) {
  if (!value) {
    return value;
  }

  if (typeof value === "string") {
    return fn(value);
  } else if (Array.isArray(value)) {
    return value.map(val => mapInternalValues(val, fn));
  } else if (typeof value === "object") {
    return flatten.unflatten(
      mapValues(flatten(value), val => mapInternalValues(val, fn))
    );
  }

  return value;
}

function convertToUpperCase(value) {
  return mapInternalValues(value, val => val.toUpperCase());
}

function convertToLowerCase(value) {
  return mapInternalValues(value, val => val.toLowerCase());
}

function isEvent(ev) {
  return !!ev && !!ev.target;
}

function prefixCharacters(value, prefixOptions) {
  return mapInternalValues(value, val => {
    const excludeEmptyString =
      typeof prefixOptions.excludeEmptyString !== "undefined"
        ? prefixOptions.excludeEmptyString
        : true;

    if (excludeEmptyString && val === "") {
      return val;
    }

    if (!!prefixOptions.predicate && !prefixOptions.predicate(val)) {
      return val;
    }

    let numRepeat = prefixOptions.wordLength
      ? prefixOptions.wordLength - val.length
      : 1;
    numRepeat = numRepeat < 0 ? 0 : numRepeat;

    return `${prefixOptions.character.repeat(numRepeat)}${value}`;
  });
}

function trimData(value) {
  return mapInternalValues(value, val => val.trim());
}

function normalizeWhitespace(
  value,
  { numSpacesToPreserve } = {
    numSpacesToPreserve: 0
  }
) {
  if (!value) {
    return value;
  }

  return mapInternalValues(value, val => {
    let finalString = "";
    let tempString = "";
    let encounterStartingSpace = false;
    let numberOfSpaceInBetween = 0;

    const userInputArrayMode = val.split("");

    userInputArrayMode.forEach(element => {
      if (element !== " " && !encounterStartingSpace) {
        tempString += element;
      } else if (element === " ") {
        tempString += element;
        numberOfSpaceInBetween += 1;
        encounterStartingSpace = true;
      } else if (numberOfSpaceInBetween <= numSpacesToPreserve) {
        finalString += tempString;
        tempString = element;
        numberOfSpaceInBetween = 0;
        encounterStartingSpace = false;
      } else if (numberOfSpaceInBetween > numSpacesToPreserve) {
        const afterTrimTempString = tempString.replace(
          / +/g,
          " ".repeat(numSpacesToPreserve)
        );
        finalString += afterTrimTempString;
        tempString = element;
        numberOfSpaceInBetween = 0;
        encounterStartingSpace = false;
      }
    });
    finalString += tempString;
    return finalString;
  });
}

const FieldInner = ({
  component: Component,
  fieldProps,
  forceLowerCase,
  forceUpperCase,
  name,
  onBlur,
  onChange,
  onKeyPress,
  prefixOptions,
  preventCopy,
  preventPaste,
  render,
  trim: shouldTrimData,
  normalizeWhitespace: shouldNormalizerWhitespace,
  type,
  updateInstantly,
  ...props
}) => {
  invariant(
    !(!!forceUpperCase && !!forceLowerCase),
    "[Field]: You can't have `forceUpperCase` and `forceLowerCase` both defined at the same time"
  );
  const { field, form } = fieldProps;
  const [value, setValue] = React.useState(field.value);
  const isDateType = type === "date" || type === "datetime";
  const isToggleType = type === "checkbox" || typeof value === "boolean";
  const shouldUpdateInstantly = updateInstantly || isDateType || isToggleType;
  const makeInternalValue = (innerValue, dateString) => {
    let finalValue = innerValue;

    if (
      isDateType &&
      ((!!innerValue && !moment.isMoment(innerValue)) ||
        (!!dateString && moment(dateString).isValid()))
    ) {
      finalValue = moment(dateString || innerValue);
    }

    if (forceUpperCase) {
      finalValue = convertToUpperCase(finalValue);
    }

    if (forceLowerCase) {
      finalValue = convertToLowerCase(finalValue);
    }

    return finalValue;
  };
  const makeFormikValue = innerValue => {
    let finalValue = innerValue;

    if (typeof innerValue === "undefined") {
      finalValue = null;
    }

    if (moment.isMoment(innerValue)) {
      finalValue = innerValue.format();
    }

    if (prefixOptions) {
      finalValue = prefixCharacters(finalValue, prefixOptions);
    }

    if (shouldNormalizerWhitespace) {
      finalValue = normalizeWhitespace(
        finalValue,
        typeof shouldNormalizerWhitespace !== "boolean"
          ? shouldNormalizerWhitespace
          : undefined
      );
    }

    if (shouldTrimData) {
      finalValue = trimData(finalValue);
    }

    return finalValue;
  };
  const updateFormikState = (innerValue, callback) => {
    form.setFormikState(prevState => {
      return {
        ...prevState,
        // touched: setIn(prevState.touched, name, true),
        values: setIn(prevState.values, name, innerValue)
      };
    }, callback);
  };
  const handleBlur = () => {
    const innerFormikValue = makeFormikValue(value);
    if (
      !shouldUpdateInstantly &&
      innerFormikValue !== getIn(form.values, name)
    ) {
      form.setFieldValue(name, innerFormikValue, false).then(() => {
        form.validateForm().then(() => {
          form.setFieldTouched(name, true, false);
        });
      });
      // @todo i dont know why setFormikState wont callback, temporary use this solution and observe
      // updateFormikState(innerFormikValue, () => {
      //   form.validateForm().then(() => {
      //     form.setFieldTouched(name, true, false);
      //   });
      // });
    }

    if (onBlur) {
      onBlur();
    }
  };
  const handleChange = (ev, dateString) => {
    if (!!ev && ev.persist) {
      ev.persist();
    }

    let changedValue = isEvent(ev) ? ev.target.value : ev;
    changedValue =
      isToggleType &&
      isEvent(ev) &&
      typeof ev.target.checked === "boolean" &&
      ev.target.type === "checkbox"
        ? ev.target.checked
        : changedValue;
    const innerInternalValue = makeInternalValue(changedValue, dateString);

    if (shouldUpdateInstantly && changedValue !== getIn(form.values, name)) {
      // @note we need to run all the functions in makeFormikValue as well.
      const newValue = makeFormikValue(innerInternalValue);

      updateFormikState(newValue, () => {
        form.validateForm().then(() => {
          form.setFieldTouched(name, true, false);
        });
      });
    } else {
      setValue(innerInternalValue);
    }

    if (onChange) {
      onChange(ev, dateString);
    }
  };
  const handleKeyPress = ev => {
    if (ev.key === "Enter") {
      form.handleChange(ev);
    }

    if (onKeyPress) {
      onKeyPress(ev);
    }
  };
  const handleCopy = e => {
    if (preventCopy) {
      e.preventDefault();
      e.nativeEvent.stopImmediatePropagation();
    }
  };

  const handlePaste = e => {
    if (preventPaste) {
      e.preventDefault();
      e.nativeEvent.stopImmediatePropagation();
    }
  };

  const internalValue = makeInternalValue(value);

  React.useEffect(() => {
    if (value !== field.value) {
      setValue(field.value);
    }
  }, [field.value]);

  const finalProps = {
    id: field.name,
    type,
    ...props,
    ...field,
    autoComplete: "off",
    checked: isToggleType ? internalValue : undefined,
    onBlur: handleBlur,
    onChange: handleChange,
    onCopy: handleCopy,
    onKeyPress: handleKeyPress,
    onPaste: handlePaste,
    value: internalValue
  };

  if (render) {
    return render(finalProps);
  }

  return <Component {...finalProps} />;
};

const Field = ({
  defaultNS,
  i18nOptions,
  name,
  reportNS,
  shouldUpdate,
  ...props
}) => (
  <BaseField
    name={name}
    render={fieldProps => (
      <FieldInner name={name} fieldProps={fieldProps} {...props} />
    )}
    shouldUpdate={shouldUpdate}
  />
);

export default Field;
