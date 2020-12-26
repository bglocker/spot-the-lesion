import React from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { FaMedal } from "react-icons/fa";

const useStyles = makeStyles((theme) =>
  createStyles({
    table: {
      backgroundColor: "#C4DFE6",
      borderStyle: "solid",
      borderWidth: "thick",
      borderColor: "#003B46",
    },
    tableHead: {
      backgroundColor: "#07575B",
    },
    tableContainer: {
      marginTop: 50,
      width: "70%",
      alignSelf: "center",
    },
    tableCell: {
      [theme.breakpoints.only("xs")]: {
        fontSize: "60%",
      },
      [theme.breakpoints.only("sm")]: {
        fontSize: "110%",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "150%",
      },
      color: "white",
      fontFamily: "segoe UI",
      fontWeight: "bold",
    },
    style: {
      [theme.breakpoints.only("xs")]: {
        fontSize: "60%",
      },
      [theme.breakpoints.only("sm")]: {
        fontSize: "110%",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "150%",
      },
      fontWeight: "bold",
      fontFamily: "segoe UI",
    },
    tableRow: {
      borderColor: "#003B46",
      borderWidth: "medium",
      borderStyle: "solid",
    },
    tableRowCell: {
      [theme.breakpoints.only("xs")]: {
        fontSize: "60%",
      },
      [theme.breakpoints.only("sm")]: {
        fontSize: "110%",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "150%",
      },
      fontFamily: "segoe UI",
      fontWeight: "bold",
    },
  })
);

/**
 * Function for showing a medal icon for top 3 in Leaderboard
 * @param medal - indicates whether a medal should be present
 */
const showMedal = (medal: boolean) => {
  return medal ? <FaMedal /> : null;
};

/**
 * Basic React Functional Component for building up a simple table
 * @param firstTimeOpened - tells whether a Tab was clicked on for the first time
 * @param scores - array of ScoreType to populate the table with data
 * @constructor
 */
const BasicTable: React.FC<BasicTableProps> = ({ firstTimeOpened, scores }: BasicTableProps) => {
  const classes = useStyles();

  if (firstTimeOpened) {
    return null;
  }

  return (
    <TableContainer className={classes.tableContainer} component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead className={classes.tableHead}>
          <TableRow>
            <TableCell className={classes.tableCell} align="center">
              RANK
            </TableCell>
            <TableCell className={classes.tableCell} align="center">
              USERNAME
            </TableCell>
            <TableCell className={classes.tableCell} align="center">
              SCORE
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {scores.map((row) => (
            <TableRow
              style={{ backgroundColor: row.getColour() }}
              className={classes.tableRow}
              key={row.getUser()}
            >
              <TableCell className={classes.tableRowCell} align="center">
                {row.getRank()}
              </TableCell>
              <TableCell className={classes.tableRowCell} align="center" component="th" scope="row">
                {showMedal(row.getMedal())} {row.getUser()}
              </TableCell>
              <TableCell className={classes.tableRowCell} align="center">
                {row.getScore()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BasicTable;
