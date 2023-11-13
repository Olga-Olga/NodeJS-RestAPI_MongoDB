import ElasticEmail from "@elasticemail/elasticemail-client";
import "dotenv/config";
const sendEmail = ({ userEmail, title, bodyContent }) => {
  const { ELASTICEMAIL_API_KEY, ELASTICEMAIL_FROM } = process.env;

  const defaultClient = ElasticEmail.ApiClient.instance;

  const { apikey } = defaultClient.authentications;
  apikey.apiKey = ELASTICEMAIL_API_KEY;

  const api = new ElasticEmail.EmailsApi();

  const email = ElasticEmail.EmailMessageData.constructFromObject({
    Recipients: [new ElasticEmail.EmailRecipient(userEmail)],
    Content: {
      Body: [
        ElasticEmail.BodyPart.constructFromObject({
          ContentType: "HTML",
          Content: bodyContent,
        }),
      ],
      Subject: title,
      From: ELASTICEMAIL_FROM,
    },
  });

  const callback = function (error, data, response) {
    if (error) {
      console.error(error);
    } else {
      console.log("API called successfully.");
    }
  };
  api.emailsPost(email, callback);
};
export default sendEmail;
