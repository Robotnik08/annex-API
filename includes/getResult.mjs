/**
 * @file getResult.mjs
 * @description This file contains the template for the root function for the result.
 * @module ResponseHandler
 */

import { json } from "express";
import fetch from "node-fetch";

// root function for the result
export class ResponseHandler {
  handler(req, res, next) {
    // get the result from the request and send it back to the client, implement in the future

    const url =//api variables
      "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1";
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNjM3NzgwMDliNjM1ZDA2NTVkMTdjMmFlYTc2YzIzZiIsInN1YiI6IjY0Zjg3MjU5NWYyYjhkMDBjNDM1MWNjMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.B9_HCUeJyEZWDTNF31ZVhYdxTmeymyidiPPfyu50dVg",
      },
    };

    fetch(url, options) // fetch the data from the API
      .then((res) => res.json())
      .then((json) => {
        res.json({
          movie: json.results[0].title, //send to the client
        });
      })
      .catch((err) => console.error("error:" + err));

    // send an test JSON object
  }
}
