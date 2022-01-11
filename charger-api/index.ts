import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import axios from 'axios';

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log('HTTP trigger function processed a request.');
  if (req.query.chargerId && req.query.code && req.query.clientId) {
    try {
      const response = await axios.get(
        `https://api.emabler.net/api/charger/${req.query.chargerId}?code=${req.query.code}&clientId=${req.query.clientId}`,
        {
          headers: {
            'x-functions-key': req.query.code,
          },
        }
      );

      const { activeConnection, chargerStatus } = response.data;

      context.res = {
        // status: 200, /* Defaults to 200 */
        body: { activeConnection, chargerStatus },
      };
    } catch {
      context.res = {
        status: 400,
        body: 'Request failed. Check query parameters',
      };
    }
  } else {
    context.res = {
      status: 400,
      body: 'Request failed. Check query parameters',
    };
  }
};

export default httpTrigger;
