/**
 * @file getResult.mjs
 * @description This file contains the template for the root function for the result.
 * @module ResponseHandler
 */

import fetch from "node-fetch";

const API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNjM3NzgwMDliNjM1ZDA2NTVkMTdjMmFlYTc2YzIzZiIsInN1YiI6IjY0Zjg3MjU5NWYyYjhkMDBjNDM1MWNjMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.B9_HCUeJyEZWDTNF31ZVhYdxTmeymyidiPPfyu50dVg";

export class ResponseHandler {
    handler(req, res, next) {
        // get the search query from the headers
        let searchQuery = req.headers.request;
        if (searchQuery === undefined) {
            res.status(400).json({message: "No search query provided."});
            return;
        }
        try {
            searchQuery = JSON.parse(searchQuery);
        } catch (error) {
            res.status(400).json({message: "Search query format is not JSON."});
            return;
        }
        switch (searchQuery.type) {
            case "movie":
                if (searchQuery.id === undefined) {
                    res.status(400).json({message: "No movie ID provided."});
                    return;
                } else if (typeof searchQuery.id !== "number") {
                    res.status(400).json({message: "Movie ID must be a number."});
                    return;
                }
                handleMovieRequest(req, res, next, searchQuery.id);
                break;
            case "showing":
                break;
            case "now_playing":
                searchQuery.page ??= 1;
                if (typeof searchQuery.page !== "number") {
                    res.status(400).json({message: "Page number must be a number."});
                    return;
                }
                handleNowPlayingRequest(req, res, next, searchQuery.page);
                break;
            default:
                res.status(400).json({message: "Invalid search query type. Must be one of: movie, showing, now_playing."});
        }
        // send an test JSON object
        function handleMovieRequest (req, res, next, id) {
            // get the movie info from the movie database from the id
            const url = `https://api.themoviedb.org/3/movie/${id}?language=en-US`;
            const options = {
                method: "GET",
                headers: {
                    accept: "application/json",
                    Authorization: `Bearer ${API_KEY}`,
                }
            };
            fetch(url, options).then((res) => res.json())
            .then((json) => {
                res.json(json);
            });
        }
        function handleNowPlayingRequest (req, res, next, page) {
            // get the movie info from the movie database from the id
            const url = `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${page}`;
            const options = {
                method: "GET",
                headers: {
                    accept: "application/json",
                    Authorization: `Bearer ${API_KEY}`,
                }
            };
            fetch(url, options).then((res) => res.json())
            .then((json) => {
                res.json(json);
            });
        }
    }
}