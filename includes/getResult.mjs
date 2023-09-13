/**
 * @file getResult.mjs
 * @description This file contains the template for the root function for the result.
 * @module ResponseHandler
 */

import fetch from "node-fetch";

const API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNjM3NzgwMDliNjM1ZDA2NTVkMTdjMmFlYTc2YzIzZiIsInN1YiI6IjY0Zjg3MjU5NWYyYjhkMDBjNDM1MWNjMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.B9_HCUeJyEZWDTNF31ZVhYdxTmeymyidiPPfyu50dVg";
const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_KEY}`,
    }
};
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
            case "cast":
                if (searchQuery.id === undefined) {
                    res.status(400).json({message: "No movie ID provided."});
                    return;
                } else if (typeof searchQuery.id !== "number") {
                    res.status(400).json({message: "Movie ID must be a number."});
                    return;
                }
                handleCastRequest(req, res, next, searchQuery.id);
                break;
            case "now_playing":
                searchQuery.page ??= 1;
                if (typeof searchQuery.page !== "number") {
                    res.status(400).json({message: "Page number must be a number."});
                    return;
                }
                handleNowPlayingRequest(req, res, next, searchQuery.page);

                break;
            case "showing":
                searchQuery.day ??= new Date().toISOString().split("T")[0];

                break;
            default:
                res.status(400).json({message: "Invalid search query type. Must be one of: movie, showing, now_playing or cast."});
        }
        function handleMovieRequest (req, res, next, id) {
            // get the movie info from the movie database from the id
            const url = `https://api.themoviedb.org/3/movie/${id}?language=en-US`;
            fetch(url, options).then((res) => res.json())
            .then((json) => {
                res.json(convertMovieToJson(json));
            });
        }
        function handleNowPlayingRequest (req, res, next, page) {
            // get the movie info from the movie database from the id
            const url = `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${page}`;
            fetch(url, options).then((res) => res.json())
            .then((json) => {
                res.json(convertNowPlayingJson(json));
            });
        }
        function handleCastRequest (req, res, next, id) {
            // get the cast data from the movie database from the id
            const url = `https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`;
            fetch(url, options).then((res) => res.json())
            .then((json) => {
                res.send(convertCast(json));
            });
        }
        function convertNowPlayingJson(json){
            const result = {
                results: []
            }
             for (let movie of json.results){
                result.results.push(convertMovieToJson(movie));
             }
            return result;
        }

        function convertCast(json){
            const result = {
                movie_id: json.id,
                cast: []
            }
            for (let cast of json.cast) {
                result.cast.push({
                    name: cast.name,
                    gender: cast.gender,
                    department: cast.known_for_department,
                    profile_picture: "https://image.tmdb.org/t/p/original" + cast.profile_path,
                    character: cast.character,
                    order: cast.order
                });
            }

            return result
        }

        function convertMovieToJson (json) {
            const result = {
                movie_id: json.id,
                movie_name: json.title,
                movie_date: json.release_date,
                age_rating: json.adult ? "18+" : false,
                runtime: json.runtime,
                genres: json.genres ? [] : undefined,
                rating: json.vote_average,
                release_date: json.release_date,
                duration: json.runtime,
                poster: "https://image.tmdb.org/t/p/original" + json.poster_path,
                big_discription: json.overview,
                small_discription: json.tagline,
                original_language: json.original_language,
                counrty_of_origin: json.production_countries ? json.production_countries[0].name : undefined,
                status: json.status,
                production_companies: json.production_companies ? [] : undefined
            }
            if (json.genres) for (let genre of json.genres) {
                result.genres.push(genre.name);
            }
            if (json.production_companies) for (let comp of json.production_companies){
                result.production_companies.push(comp.name);
            }
            return result;
        }
    }
}