import { addProxyToClient } from "aws-sdk-v3-proxy";
import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm";

export class AWSUtils {
  ssm: SSMClient;

  constructor() {
    this.ssm = addProxyToClient(
      new SSMClient({
        region: "eu-central-1",
      }),
      {
        httpsOnly: true,
        debug: true,
      }
    );
  }

  async sendParameterRequest(params) {
    const command = new GetParameterCommand(params);
    const response = await this.ssm.send(command); // Response contains the Client ID
    // console.log(response);
    return response;
  }

  async getParameter(name = "", withDecryption = false) {
    console.log(
      `Fetching SSM Parameter ${name} with decryption ${withDecryption}`
    );
    const params = {
      Name: name,
      WithDecryption: withDecryption,
    };
    return (await this.sendParameterRequest(params)).Parameter;
  }
}
