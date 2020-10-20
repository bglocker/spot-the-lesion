import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

interface ScoreType {
  user: string;
  score: number;
}

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(user: string, score: number): ScoreType {
  return { user, score };
}

function createRows(results: ScoreType[]): ScoreType[] {
  results.forEach((entry) => {
    createData(entry.user, entry.score);
  });
  return results;
}

export default function BasicTable(results: ScoreType[]) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Rank</TableCell>
            <TableCell align="center">Username</TableCell>
            <TableCell align="center">Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {createRows(results).map((row) => (
            <TableRow key={row.user}>
              <TableCell align="center" component="th" scope="row">
                {row.user}
              </TableCell>
              <TableCell align="center">{row.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
