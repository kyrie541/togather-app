import React from "react";
import moment from "moment";
import { Button, Divider, message, Modal, Popconfirm, Table, Tag } from "antd";
import { apiCall } from "../../services/api";
import { get, set } from "lodash";
import { connect } from "react-redux";

import "./styles.module.css";

const EventListPage = ({ currentUser, history }) => {
  const [events, setEvents] = React.useState(null);
  const [isEventDetailModalOpen, setIsEventDetailModalOpen] = React.useState(
    false
  );
  const [selectedEvent, setSelectedEvent] = React.useState();
  const [participants, setParticipants] = React.useState([]);

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
  };

  const handleViewEventDetails = async record => {
    const participantsArray = [];

    for (var i = 0; i < record.participants.length; i++) {
      await apiCall("get", `/api/users/${record.participants[i]}`)
        .then(user => {
          participantsArray.push(user);
        })
        .catch(err => {
          message.error(`Participant ${err}`);
        });
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
  };

  const handleCancel = () => {
    setIsEventDetailModalOpen(false);
    setSelectedEvent(null);
  };

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
  });

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
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <span>
          <a href="#" onClick={() => handleViewEventDetails(record)}>
            View Details
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title="Are you sure delete this event?"
            onConfirm={() => handleConfirmDelete(record)}
            okText="Yes"
            cancelText="No"
            disabled={record.creator._id !== currentUser.user.id}
          >
            <a href="#" disabled={record.creator._id !== currentUser.user.id}>
              Delete
            </a>
          </Popconfirm>
        </span>
      )
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
      />

      <Button type="primary" onClick={handleClick}>
        Create Event
      </Button>
      <Modal
        title="Event Details"
        visible={isEventDetailModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={
          !!get(selectedEvent, "participants") &&
          !selectedEvent.participants.includes(currentUser.user.id)
            ? "Join Now!"
            : "Not Going"
        }
        okType={
          !!get(selectedEvent, "participants") &&
          !selectedEvent.participants.includes(currentUser.user.id)
            ? "primary"
            : "danger"
        }
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
          <span className="boldText">Participant: </span>
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
