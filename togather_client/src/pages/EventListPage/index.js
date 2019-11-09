import React from "react";
import moment from "moment";
import { Button, Divider, message, Popconfirm, Table } from "antd";
import { apiCall } from "../../services/api";

const EventListPage = ({ history }) => {
  const [events, setEvents] = React.useState(null);

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
      key: "creator.username"
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location"
    },
    {
      key: "planStartDate",
      dataIndex: "planStartDate",
      render: planStartDate =>
        !!planStartDate
          ? moment(planStartDate).format(`DD/MM/YYYY h:mm A`)
          : "-",
      title: "Time"
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <span>
          <a>View Details</a>
          <Divider type="vertical" />
          <Popconfirm
            title="Are you sure delete this event?"
            onConfirm={() => handleConfirmDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <a href="#">Delete</a>
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
      />
      ;
      <Button type="primary" onClick={handleClick}>
        Create Event
      </Button>
    </div>
  );
};

export default EventListPage;
