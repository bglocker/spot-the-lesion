import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { FaMedal } from "react-icons/fa";
import ScoreType from "../../utils/ScoreType";

const useStyles = makeStyles({
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
    color: "white",
    fontSize: "150%",
    fontFamily: "segoe UI",
    fontWeight: "bold",
  },
  style: {
    fontSize: "150%",
    fontWeight: "bold",
    fontFamily: "segoe UI",
  },
  tableRow: {
    borderColor: "#003B46",
    borderWidth: "medium",
    borderStyle: "solid",
  },
  tableRowCell: {
    fontSize: "150%",
    fontFamily: "segoe UI",
    fontWeight: "bold",
  },
});

const showMedal = (medal: boolean) => {
  return medal ? <FaMedal /> : null;
};

export default function BasicTable(results: ScoreType[], usedOnce: number) {
  const classes = useStyles();
  if (usedOnce === 0) {
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
          {results.map((row) => (
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
}
