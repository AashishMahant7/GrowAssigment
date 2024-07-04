import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Collapse,
  ListItemIcon,
  Checkbox,
  Typography,
  Card,
  CardContent,
  IconButton,
  Divider
} from '@mui/material';
import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon
} from '@mui/icons-material';
import departmentsData from './../DepartmentList.json';

const DepartmentList: React.FC = () => {
  const [open, setOpen] = useState<{ [key: string]: boolean }>({});
  const [selected, setSelected] = useState<{ [key: string]: boolean }>({});
  const [departments, setDepartments] = useState<any[]>([]);

  useEffect(() => {
    setDepartments(departmentsData);
  }, []);

  const handleClick = (department: string) => {
    setOpen((prevOpen) => ({ ...prevOpen, [department]: !prevOpen[department] }));
  };

  const handleSelect = (key: string, isSubDepartment: boolean) => {
    setSelected((prevSelected) => {
      const newSelected = { ...prevSelected, [key]: !prevSelected[key] };

      if (!isSubDepartment) {
        const department = departments.find((dept) => dept.department === key);
        if (department) {
          department.sub_departments.forEach((subDept: string) => {
            newSelected[subDept] = newSelected[key];
          });
        }
      } else {
        const department = departments.find((dept) =>
          dept.sub_departments.includes(key)
        );
        if (department) {
          const allSelected = department.sub_departments.every(
            (subDept: string) => newSelected[subDept]
          );
          newSelected[department.department] = allSelected;
        }
      }

      return newSelected;
    });
  };

  return (
    <Card elevation={3} sx={{ mt: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Departments
        </Typography>
        <Divider />
        <List sx={{ maxHeight: 400, overflow: 'auto' }}>
          {departments.map((dept) => (
            <div key={dept.department}>
              <ListItem button onClick={() => handleClick(dept.department)}>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={!!selected[dept.department]}
                    icon={<CheckBoxOutlineBlankIcon />}
                    checkedIcon={<CheckBoxIcon />}
                    tabIndex={-1}
                    disableRipple
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(dept.department, false);
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={dept.department}
                  primaryTypographyProps={{ variant: 'h6' }}
                />
                <IconButton edge="end" size="small">
                  {open[dept.department] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </ListItem>
              <Collapse in={open[dept.department]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {dept.sub_departments.map((subDept: string) => (
                    <ListItem key={subDept} sx={{ pl: 4 }} button>
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={!!selected[subDept]}
                          icon={<CheckBoxOutlineBlankIcon />}
                          checkedIcon={<CheckBoxIcon />}
                          tabIndex={-1}
                          disableRipple
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelect(subDept, true);
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={subDept}
                        primaryTypographyProps={{ variant: 'body1' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
              <Divider />
            </div>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default DepartmentList;
