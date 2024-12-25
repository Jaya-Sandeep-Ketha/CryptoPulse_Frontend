/* eslint-disable no-unused-vars */
import api from "@/Api/api";
import {
  CHAT_BOT_FAILURE,
  CHAT_BOT_REQUEST,
  CHAT_BOT_SUCCESS,
} from "./ActionTypes";

// export const sendMessage =
//   ({ prompt, jwt }) =>
//   async (dispatch) => {
//     dispatch({
//       type: CHAT_BOT_REQUEST,
//       payload: { prompt, role: "user" },
//     });

//     try {
//       const { data } = await api.post(
//         "/chat/bot/coin",
//         { prompt },
//         {
//           headers: {
//             Authorization: `Bearer ${jwt}`,
//           },
//         }
//       );
//       dispatch({
//         type: CHAT_BOT_SUCCESS,
//         payload: { ans: data.message, role: "model" },
//       });
//       console.log("get success ans", data);
//     } catch (error) {
//       dispatch({ type: CHAT_BOT_FAILURE, payload: error });
//       console.log(error);
//     }
//   };

export const sendMessage =
  ({ prompt, jwt }) =>
  async (dispatch) => {
    // Dispatch user message
    dispatch({
      type: CHAT_BOT_REQUEST,
      payload: { prompt, role: "user" },
    });

    try {
      // Make API call
      const { data } = await api.post(
        "/chat/bot/coin",
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      // Ensure the response structure is correct
      if (data?.messages && Array.isArray(data.messages)) {
        const botMessage = data.messages.find((msg) => msg.role === "bot");

        if (botMessage) {
          // Dispatch the bot's response
          dispatch({
            type: CHAT_BOT_SUCCESS,
            payload: { ans: botMessage.ans, role: "bot" },
          });
          console.log("Bot response:", botMessage.ans);
        } else {
          console.error("No bot message found in response:", data);
          throw new Error("Invalid bot response structure.");
        }
      } else {
        console.error("Unexpected response format:", data);
        throw new Error("Invalid API response structure.");
      }
    } catch (error) {
      // Dispatch failure and log the error
      dispatch({ type: CHAT_BOT_FAILURE, payload: error.message || error });
      console.error("Error in chatbot API call:", error);
    }
  };
