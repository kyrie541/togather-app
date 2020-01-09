import React from "react";
import moment from "moment";
import { Button, Divider, message, Modal, Popconfirm, Table, Tag } from "antd";
import { apiCall } from "../../services/api";
import { get, set } from "lodash";
import { connect } from "react-redux";

import "./styles.module.css";

const EventListPage = ({ currentUser, history, location }) => {
  const [events, setEvents] = React.useState(null);

  const [isEventDetailModalOpen, setIsEventDetailModalOpen] = React.useState(
    false
  );
  const [selectedEvent, setSelectedEvent] = React.useState();
  const [participants, setParticipants] = React.useState([]);

  React.useEffect(() => {
    if (events === null) {
      apiCall("get", `/api/events`)
        .then(events => {
          setEvents(events);
        })
        .catch(err => {
          message.error(err);
        });
    }

    if (
      get(location, "hash") &&
      Array.isArray(events) &&
      events.length > 0 &&
      !isEventDetailModalOpen
    ) {
      const hashEvent = events.find(event => {
        return event._id === get(location, "hash").replace("#", "");
      });

      !!hashEvent ? handleViewEventDetails(hashEvent) : undefined;
    }
  });

  const handleClick = () => {
    history.push("/events/create");
  };

  const handleConfirmDelete = async record => {
    apiCall("delete", `/api/events/${record._id}`)
      .then(event => {
        const newEvents = events.filter(innerEvent => {
          return event._id !== innerEvent._id;
        });
        setEvents(newEvents);
        message.success(`Event ${event.title} has been deleted.`);
      })
      .catch(err => {
        message.error(err);
      });

    history.push(`/events`);
    setIsEventDetailModalOpen(false);
  };

  const handleViewEventDetails = async record => {
    const participantsArray = [];

    // because participants is not iterate, so make another apiCall again
    if (record.participants.length > 0) {
      for (var i = 0; i < record.participants.length; i++) {
        await apiCall("get", `/api/users/${record.participants[i]}`)
          .then(user => {
            participantsArray.push(user);
          })
          .catch(err => {
            message.error(`Participant ${err}`);
          });
      }
    }

    setParticipants(
      participantsArray.map(participant => {
        return participant.username;
      })
    );
    setIsEventDetailModalOpen(true);
    setSelectedEvent(record);
  };

  const handleOk = async () => {
    if (!selectedEvent.participants.includes(currentUser.user.id)) {
      const newParticipants = [...selectedEvent.participants];

      newParticipants.push(currentUser.user.id);

      const newEvent = { ...selectedEvent };
      set(newEvent, "participants", newParticipants);

      apiCall("put", `/api/events/${selectedEvent._id}`, newEvent)
        .then(event => {
          const newEvents = events.map(innerEvent => {
            if (innerEvent._id === event._id) {
              innerEvent.participants = event.participants;
              return innerEvent;
            } else {
              return innerEvent;
            }
          });
          setEvents(newEvents);

          message.success(`Event ${event.title} has been updated.`);
        })
        .catch(err => {
          message.error(err);
        });
    } else {
      const newParticipants = [...selectedEvent.participants].filter(
        participant => {
          return participant !== currentUser.user.id;
        }
      );

      const newEvent = { ...selectedEvent };
      set(newEvent, "participants", newParticipants);

      apiCall("put", `/api/events/${selectedEvent._id}`, newEvent)
        .then(event => {
          const newEvents = events.map(innerEvent => {
            if (innerEvent._id === event._id) {
              innerEvent.participants = event.participants;
              return innerEvent;
            } else {
              return innerEvent;
            }
          });

          setEvents(newEvents);
          message.success(`Event ${event.title} has been updated.`);
        })
        .catch(err => {
          message.error(err);
        });
    }

    setIsEventDetailModalOpen(false);
    setSelectedEvent(null);
    history.push(`/events`);
  };

  const handleCancel = () => {
    setIsEventDetailModalOpen(false);
    setSelectedEvent(null);
    history.push(`/events`);
  };

  const handleRowClick = (record, rowIndex) => {
    return {
      onClick: () => {
        history.push(`/events#${record._id}`);
        handleViewEventDetails(record);
      }
    };
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title"
    },
    {
      title: "Host",
      dataIndex: "creator.username",
      key: "creator.username",
      render: creatorName =>
        !!creatorName ? (
          <div className="hideWhenMobile">{creatorName}</div>
        ) : (
          "-"
        )
    },
    {
      key: "planStartDate",
      dataIndex: "planStartDate",
      render: planStartDate =>
        !!planStartDate
          ? moment(planStartDate).format(`dddd, DD/MM h:mm A`)
          : "-",
      title: "Time"
    },
    {
      title: "Status",
      render: record => {
        if (moment().isSameOrAfter(moment(record.planStartDate))) {
          return <Tag color="yellow">End</Tag>;
        } else if (record.participants.includes(currentUser.user.id)) {
          return <Tag color="green">Going</Tag>;
        } else {
          return <Tag color="red">Not Going</Tag>;
        }
      },

      key: "location"
    }
  ];

  return (
    <div>
      <h4>Event List page</h4>
      <Table
        dataSource={events}
        columns={columns}
        pagination={{ pageSize: 10 }}
        className="eventListTable"
        onRow={handleRowClick}
      />

      <Button type="primary" onClick={handleClick}>
        Create Event
      </Button>
      <Modal
        title="Event Details"
        visible={isEventDetailModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Popconfirm
            title="Are you sure delete this event?"
            onConfirm={() => handleConfirmDelete(selectedEvent)}
            okText="Yes"
            cancelText="No"
            disabled={get(selectedEvent, "creator._id") !== currentUser.user.id}
          >
            <Button
              disabled={
                get(selectedEvent, "creator._id") !== currentUser.user.id
              }
            >
              Delete
            </Button>
          </Popconfirm>,
          <Button
            key="submit"
            type={
              !!get(selectedEvent, "participants") &&
              !selectedEvent.participants.includes(currentUser.user.id)
                ? "primary"
                : "danger"
            }
            onClick={handleOk}
          >
            {!!get(selectedEvent, "participants") &&
            !selectedEvent.participants.includes(currentUser.user.id)
              ? "Join Now!"
              : "Not Going"}
          </Button>
        ]}
      >
        <p>
          <span className="boldText">Title: </span>
          {get(selectedEvent, "title")}
        </p>
        <p>
          <span className="boldText">Description: </span>
          {get(selectedEvent, "description")}
        </p>
        <p>
          <span className="boldText">Location: </span>
          {get(selectedEvent, "location")}
        </p>
        <p>
          <span className="boldText">Event Time: </span>
          {!!get(selectedEvent, "planStartDate")
            ? moment(get(selectedEvent, "planStartDate")).format(
                `dddd, DD/MM/YYYY h:mm A`
              )
            : "-"}
        </p>
        <p>
          <span className="boldText">Host: </span>
          {get(selectedEvent, "creator.username")}
        </p>
        <p>
          <span className="boldText">Participants: </span>
          {participants.join(", ")}
        </p>
      </Modal>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser
  };
}

export default connect(mapStateToProps, undefined)(EventListPage);
