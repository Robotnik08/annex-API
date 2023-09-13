/**
 * @file getResult.mjs
 * @description This file contains the template for the root function for the result.
 * @module ResponseHandler
 */

import fetch from "node-fetch";
import { API_KEY } from "./getConfig.mjs";
import { createConnection } from "mysql";

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
                searchQuery.day ??= Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
                if (typeof searchQuery.day !== "number") {
                    res.status(400).json({message: "Day must be a number."});
                    return;
                }
                if (searchQuery.location === undefined) {
                    res.status(400).json({message: "No location provided."});
                    return;
                }
                if (typeof searchQuery.location !== "string") {
                    res.status(400).json({message: "Location must be a string."});
                    return;
                }
                if (searchQuery.location.split(" ").length > 1 || !(/^[A-Za-z]+$/).test(searchQuery.location)) { 
                    res.status(400).json({message: "Invalid location."});
                    return;
                }
                handleShowingRequest(req, res, next, searchQuery.day, searchQuery.location);
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
        function handleShowingRequest (req, res, next, day, location) {
            //get showing data from the local SQL database
            if (day < 0 || day > 365) {
                res.status(400).json({message: "Invalid day. Must be between 0 and 365."});
                return;
            }
            const connection = createConnection({
                host: "localhost",
                user: "root",
                password: "",
                database: "annex-bios"
            });
            connection.connect();
            const query = `SELECT * FROM showing WHERE DAYOFYEAR(time) = '${day}' AND theatre = '${location}'`;
            connection.query(query, (error, results, fields) => {
                if (error) {
                    res.status(500).json({message: "Internal server error. (query might be invalid)"});
                    return;
                }
                if (results.length === 0) {
                    res.status(404).json({message: "No showings found."});
                    return;
                }
                res.json(convertShowingJson(results));
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
        function convertShowingJson(json){
            return json;
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