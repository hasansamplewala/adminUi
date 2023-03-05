import {
  Checkbox,
  IconButton,
  TableCell,
  TableRow,
  TextField,
} from "@mui/material";
import { Stack } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useState } from "react";

function UserRow({
  name,
  email,
  role,
  id,
  handleSelectUser,
  selectedUsers,
  deleteSelectedUser,
  handleSaveFormData,
}) {
  const [isEditable, setIsEditable] = useState(false);
  const [userFormData, setUserFormData] = useState({
    name: name,
    email: email,
    role: role,
  });

  function handleFormInputChange(event) {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  }

  const isSelected = selectedUsers.includes(id);
  const bulkSelectionIsActive = selectedUsers.length === 0 ? false : true;

  const actionButtons = (
    <Stack direction="row">
      <IconButton
        disabled={bulkSelectionIsActive}
        id={id}
        onClick={() => {
          deleteSelectedUser(id);
        }}
        aria-label="delete-buttons"
      >
        <DeleteIcon color="warning" />
      </IconButton>
      <IconButton
        disabled={bulkSelectionIsActive ? true : false}
        id={id}
        onClick={() => {
          if (isEditable === false) setIsEditable(true);
          if (isEditable === true) {
            handleSaveFormData(id, userFormData);
            setIsEditable(false);
          }
        }}
        aria-label="edit-button"
      >
        {isEditable ? <SaveIcon color="primary" /> : <EditIcon />}
      </IconButton>
    </Stack>
  );
  return (
    <TableRow
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
        backgroundColor: isSelected ? "#C4C4C4" : "#FFFFF",
      }}
    >
      <TableCell align="left">
        <Checkbox
          checked={isSelected}
          id={id}
          onChange={(e) => {
            handleSelectUser(e.target.id);
          }}
        />
      </TableCell>
      <TableCell align="left">
        {isEditable ? (
          <TextField
            name="name"
            onChange={handleFormInputChange}
            size="small"
            value={userFormData.name}
          />
        ) : (
          name
        )}
      </TableCell>
      <TableCell align="left">
        {isEditable ? (
          <TextField
            name="email"
            onChange={handleFormInputChange}
            size="small"
            value={userFormData.email}
          />
        ) : (
          email
        )}
      </TableCell>
      <TableCell align="left">
        {isEditable ? (
          <TextField
            name="role"
            onChange={handleFormInputChange}
            size="small"
            value={userFormData.role}
          />
        ) : (
          role
        )}
      </TableCell>
      <TableCell align="left">{actionButtons}</TableCell>
    </TableRow>
  );
}

export default UserRow;
