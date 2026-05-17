import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import { Link } from "react-router-dom";
import { MovieDetailsProps } from "../types/movieAppTypes";
import { excerpt } from "../util";
import useReviewsByMovieId from "../hooks/useReviewsByMovieId";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const styles = {
    table: {
        minWidth: 550,
    },
};

interface MovieReviewsProps extends MovieDetailsProps {
    onClose?: () => void;
}

const MovieReviews: React.FC<MovieReviewsProps> = (movie) => { 
    const reviews = useReviewsByMovieId(movie.id);

    return (
        <Box sx={{ padding: 2 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={movie.onClose}
                sx={{ mb: 2 }}
            >
                Back to Movie
            </Button>
            <TableContainer component={Paper}>
            <Table sx={styles.table} aria-label="reviews table">
                <TableHead>
                    <TableRow>
                        <TableCell >Author</TableCell>
                        <TableCell align="center">Excerpt</TableCell>
                        <TableCell align="right">More</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {reviews.map((r: any) => (
                        <TableRow key={r.id}>
                            <TableCell component="th" scope="row">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {r.author}
                                    {r.isUserSubmitted && (
                                        <Chip label="User Review" size="small" variant="outlined" />
                                    )}
                                </div>
                            </TableCell>
                            <TableCell >{excerpt(r.content)}</TableCell>
                            <TableCell >
                                {r.isUserSubmitted ? (
                                    <span style={{ color: '#999' }}>User Review</span>
                                ) : (
                                    <Link
                                        to={`/reviews/${r.id}`}
                                        state={{
                                            review: r,
                                            movie: movie,
                                        }}
                                    >
                                        Full Review
                                    </Link>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </TableContainer>
        </Box>
    );
}

export default MovieReviews;
