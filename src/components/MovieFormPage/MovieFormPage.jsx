import { useEffect, useState } from "react";
import http from "../../services/httpService";
import Joi from "joi";

export default function MovieFormPage() {
  let [genres, setGenres] = useState([]);
  let [schema, setSchema] = useState(
    Joi.object({
      title: Joi.string().alphanum().min(3).max(30).required(),
      genre: Joi.string().alphanum().min(3).max(30).required(),
      stock: Joi.number().integer().min(1).max(100).required(),
      rate: Joi.number().min(1).max(10).required()
    })
  );

  let [inputs, setInputs] = useState([
    { for: "title", label: "Title", type: "text", value: "" },
    {
      for: "genre",
      label: "Genre",
      type: "select",
      options: ["action", "comedy", "horror", "thriller"],
      value: "action"
    },
    { for: "stock", label: "Stock", type: "count", value: 0 },
    { for: "rate", label: "Rate", type: "count", value: 0 }
  ]);

  useEffect(() => {
    fetchGenresData();
  }, []);

  return (
    <>
      <div>
        <p>Movie Form</p>
        <Form submit={createMovie} schema={schema} inputs={inputs} />
      </div>
    </>
  );

  function createMovie(movieData) {
    let newMovie = {};
    newMovie.data = movieData;
    newMovie.liked = false;
    newMovie.data.genreId = getGenreIdForMovie(newMovie);
    http.post("movies", newMovie);
  }

  async function fetchGenresData() {
    let { data } = await http.get("genres");
    setGenres(data);
  }

  function getGenreIdForMovie(movie) {
    let genreId = genres.find((genre) => genre.name === movie.data.genre).id;
    return genreId;
  }
}

function Form({ submit, schema, inputs }) {
  let [inputsState, setInputsState] = useState([...inputs]);
  let [dataToSubmit, setDataToSubmit] = useState({});
  let [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // console.log("changed inputs");
    let validationObject = {};
    inputsState.forEach((input) => {
      validationObject[input.for] = input.value;
    });
    let validationResults = schema.validate(validationObject);
    if (validationResults.error) {
      setErrorMsg(validationResults.error.message);
      return;
    }
    setErrorMsg("");
    dataToSubmit = validationResults.value;
  }, [inputsState]);

  return (
    <div>
      {inputsState.map((input, i) => {
        // make a deep copy of the inputsState array
        let newInputs = JSON.parse(JSON.stringify(inputsState));
        let newInput = newInputs[i];

        if (input.type === "text") {
          return (
            <div key={i}>
              <label>{input.label}</label>
              <input
                type="text"
                value={input.value}
                onChange={(e) => {
                  newInput.value = e.target.value;
                  setInputsState(newInputs);
                }}
              />
            </div>
          );
        }
        if (input.type === "select") {
          return (
            <div key={i}>
              <label>{input.label}</label>
              <select
                onChange={(e) => {
                  newInput.value = e.target.value;
                  setInputsState(newInputs);
                }}
              >
                {input.options.map((option, i) => {
                  return (
                    <option key={i} value={option}>
                      {option}
                    </option>
                  );
                })}
              </select>
            </div>
          );
        }
        if (input.type === "count") {
          return (
            <div key={i}>
              <label>{input.label}</label>
              <div>
                <input
                  type="text"
                  value={input.value}
                  onChange={(e) => {
                    newInput.value = e.target.value;
                    if (hasNonNumbers(newInput.value)) return;
                    setInputsState(newInputs);
                  }}
                ></input>
                <div>
                  <div
                    onClick={() => {
                      incrementCountValue(+5, newInput, newInputs);
                    }}
                  >
                    +
                  </div>
                  <div
                    onClick={() => {
                      incrementCountValue(-5, newInput, newInputs);
                    }}
                  >
                    -
                  </div>
                </div>
              </div>
            </div>
          );
        }
      })}
      <div
        onClick={() => {
          if (isEmptyObject(dataToSubmit)) console.log("erros");
          else submit(dataToSubmit);
        }}
      >
        Submit
      </div>
      <p>{errorMsg}</p>
    </div>
  );

  function isEmptyObject(obj) {
    return Object.entries(obj).length === 0;
  }

  function hasNonNumbers(str) {
    let result = false;
    for (let i = 0; i < str.length; i++) {
      // get the current character
      let char = str[i];
      // parse the character to a number
      let num = Number(char);
      // check if the character is a number
      if (isNaN(num))
        // set the result to true if the character is not a number
        result = true;
    }
    return result;
  }

  function incrementCountValue(increment, newInput, newInputs) {
    newInput.value = Number(newInput.value) + increment;
    setInputsState(newInputs);
  }
}
