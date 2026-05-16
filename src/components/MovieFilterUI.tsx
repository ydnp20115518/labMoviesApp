import { useState } from "react";
import { Box, FormControl, InputLabel, Select, SelectChangeEvent, TextField, MenuItem } from "@mui/material";
import { getGenres } from "../api/tmdb-api";
import { useEffect } from "react";

export const titleFilter = (movie: any, value: string): boolean => {
    return movie.title?.toLowerCase().search(value.toLowerCase()) !== -1;
};

export const genreFilter = (movie: any, value: string) => {
    const genreId = Number(value);
    if (genreId <= 0) return true;
    if (Array.isArray((movie as { genre_ids?: number[] }).genre_ids)) {
        return (movie as { genre_ids?: number[] }).genre_ids?.includes(genreId) ?? false;
    }
    const genreIds = movie.genres?.map((g: any) => g.id);
    return genreIds ? genreIds.includes(genreId) : false;
};

type MovieFilterUIProps = {
    onFilterValuesChange: (f: string, s: string) => void;
    titleFilter: string;
    genreFilter: string;
}

const MovieFilterUI = ({ onFilterValuesChange, titleFilter: titleFilterValue, genreFilter: genreFilterValue }: MovieFilterUIProps) => {
    const [genres, setGenres] = useState([{ id: 0, name: "All" }]);

    useEffect(() => {
        getGenres().then((allGenres) => {
            setGenres([genres[0], ...allGenres]);
        });
    }, []);

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onFilterValuesChange("title", event.target.value);
    };

    const handleGenreChange = (event: SelectChangeEvent<string>) => {
        onFilterValuesChange("genre", event.target.value);
    };

    return (
        <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
                label="Filter by Title"
                variant="outlined"
                value={titleFilterValue}
                onChange={handleTitleChange}
                sx={{ minWidth: 200 }}
            />
            <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Genre</InputLabel>
                <Select
                    value={genreFilterValue}
                    onChange={handleGenreChange}
                    label="Genre"
                >
                    {genres.map((g) => (
                        <MenuItem key={g.id} value={String(g.id)}>
                            {g.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};

export default MovieFilterUI;
