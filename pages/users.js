import { Table, Row, Col, Tooltip, User, } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Users() {
  const router = useRouter();
  const [userList, setUserList] = useState([]);

  const columns = [
    { name: "EMAIL", uid: "email" },
    { name: "ACTIONS", uid: "actions" },
  ];

  useEffect(async () => {
    try {
      const response = await fetch("/api/user/get", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log(data.message)
      setUserList(data.message.map((each, index) => {
        each.id = (index + 1);
        return each;
      }));
    } catch (error) {
    }
  }, [])

  const handleDeleteUser = async (id) => {
    const response = await fetch("/api/user/delete", {
      method: "DELETE",
      body: JSON.stringify({
        id
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    setUserList(userList.filter((each, index) => each._id != id));
  }

  const renderCell = (user, columnKey) => {

    const cellValue = user[columnKey];
    switch (columnKey) {
      case "email":
        return (
          <User squared name={cellValue} css={{ p: 0 }}>
            {user.email}
          </User>
        );

      case "actions":
        return (
          <Row justify="center" align="center">
            <Col css={{ d: "flex", width: 'auto', marginLeft: '10px' }}>
              <Tooltip
                content="Delete user"
                color="error"
                onClick={() => handleDeleteUser(user._id)}
              >
                <button>
                  delete
                </button>
              </Tooltip>
            </Col>
          </Row>
        );
      default:
        return cellValue;
    }
  };
  return (
    <Table
      aria-label="Example table with custom cells"
      css={{
        height: "auto",
        minWidth: "100%",
      }}
      selectionMode="none"
    >
      <Table.Header columns={columns}>
        {(column) => (
          <Table.Column
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
          >
            {column.name}
          </Table.Column>
        )}
      </Table.Header>
      <Table.Body items={userList}>
        {(item) => (
          <Table.Row>
            {(columnKey) => (
              <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>
            )}
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
}