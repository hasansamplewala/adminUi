import {
  Button,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import { matchesSearchQuery } from "./matchesSearchQuery";
import UserRow from "./UserRow";
import Pagination from "./PaginationControls";
import { Stack } from "@mui/system";
import { Delete } from "@mui/icons-material";

function UserDashboard() {
  const URL =
    "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";
  // Store all users and filtered users in state
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  // State for debounce timer for search
  const [debounceTimer, setDebounceTimer] = useState(0);
  // State to track if search resulted in no users
  const [noUsersFlag, setNoUsersFlag] = useState(false);
  // State to track current page number
  const [currentPage, setCurrentPage] = useState(1);
  // State to track number of users to display per page
  const [usersPerPage] = useState(10);
  // State to track selected users
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Fetch all users on component mount
  useEffect(() => {
    getAllUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch all users from API
  async function getAllUsers() {
    try {
      const result = await axios.get(URL);
      const allUsers = result.data;
      saveAllUsers(allUsers);
    } catch (error) {
      console.error(error);
      alert("An error occurred while fetching users. Please try again later.");
    }
  }
  // Save all users in state
  function saveAllUsers(allUsers) {
    setAllUsers(allUsers);
    setFilteredUsers(allUsers);
  }
  // Filter users based on search query
  function performSearch(searchString, allUsers) {
    const filteredResult = allUsers.filter((user) => {
      return matchesSearchQuery(user, searchString);
    });

    // Update state based on filtered result
    if (filteredResult.length === 0) {
      setNoUsersFlag(true);
      setFilteredUsers([]);
      setCurrentPage(1);
    } else {
      setNoUsersFlag(false);
      setFilteredUsers(filteredResult);
      setCurrentPage(1);
    }
  }
  // Debounce search to reduce API calls
  const debounceSearch = (searchString, allUsers) => {
    if (debounceTimer !== 0) {
      clearTimeout(debounceTimer);
    }
    const newTimer = setTimeout(() => {
      performSearch(searchString, allUsers);
    }, 1500);

    setDebounceTimer(newTimer);
  };
  // Handle change in current page
  function handlePageChange(currentPage) {
    setCurrentPage(currentPage);
  }
  //   Handle click on a user row to select or deselected
  function handleSelectUser(id) {
    if (selectedUsers.includes(id)) {
      // Deselect user if already selected
      const newSelectedUser = [...selectedUsers];
      newSelectedUser.splice(newSelectedUser.indexOf(id), 1);
      setSelectedUsers(newSelectedUser);
    } else {
      // Select user if not already selected
      setSelectedUsers([...selectedUsers, id]);
    }
  }
  // handle selection of all users on the current page
  function handleBulkSelectUser(currentUsers) {
    const currentSelectedUsersId = currentUsers.map((user) => {
      return user.id;
    });
    if (bulkSelectionIsActive) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(currentSelectedUsersId);
    }
  }
// Delete individual users using the action button in UserRow component
  function deleteSelectedUser(id) {
    const newFilteredUsers = filteredUsers.filter((user) => {
      return user.id !== id;
    });
    setFilteredUsers(newFilteredUsers);
  }
// Delete multiple users using 'Delete Selected' button
  function handleBulkDelete() {
    if (selectedUsers.length === 0) return;
    const newFilteredUsers = filteredUsers.filter((user) => {
      return !selectedUsers.includes(user.id);
    });
    setFilteredUsers(newFilteredUsers);
    setSelectedUsers([]);
  }
  // Save the form data from users into the filtered Users list
  function handleSaveFormData(id, userFormData) {
    const newFilteredUsers = filteredUsers.map((user) => {
      if (user.id === id) {
        return userFormData;
      } else {
        return user;
      }
    });
    setFilteredUsers(newFilteredUsers);
  }
  // Calculate the users to show on the current page, based on the total pages.
  const indexOfLastUser = usersPerPage * currentPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const bulkSelectionIsActive = selectedUsers.length === 0 ? false : true;

  const tableHeaderCellStyle = {
    backgroundColor: "#f5f5f5",
    fontWeight: "bold",
  };
  return (
    <>
      <SearchBar allUsers={allUsers} debounceSearch={debounceSearch} />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox
                  checked={bulkSelectionIsActive}
                  onChange={() => {
                    handleBulkSelectUser(currentUsers);
                  }}
                />
              </TableCell>
              <TableCell style={tableHeaderCellStyle}>Name</TableCell>
              <TableCell style={tableHeaderCellStyle} align="left">
                Email
              </TableCell>
              <TableCell style={tableHeaderCellStyle} align="left">
                Role
              </TableCell>
              <TableCell style={tableHeaderCellStyle} align="left">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {noUsersFlag ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <h5>No Users Found!</h5>
                </TableCell>
              </TableRow>
            ) : (
              currentUsers.map((user) => (
                <UserRow
                  key={user.id}
                  id={user.id}
                  name={user.name}
                  email={user.email}
                  role={user.role}
                  handleSelectUser={handleSelectUser}
                  selectedUsers={selectedUsers}
                  deleteSelectedUser={deleteSelectedUser}
                  handleSaveFormData={handleSaveFormData}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack
        justifyContent="space-between"
        sx={{ marginTop: "10px" }}
        direction="row"
      >
        <Button
          onClick={handleBulkDelete}
          variant="contained"
          color="warning"
          startIcon={<Delete />}
          size="small"
        >
          Delete Selected
        </Button>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </Stack>
    </>
  );
}

export default UserDashboard;
