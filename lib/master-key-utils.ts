import invariant from "tiny-invariant";
import createHttpsProxyAgent from "https-proxy-agent";
import fetch from "cross-fetch";
import { getSherpaAuthParameters } from "./aws";
import axios from "axios";
import { ErrorWithDetails } from "./error";

export class MasterKeyUtils {
  static get mkgEndpoint() {
    invariant(process.env.mkgEndpoint, "process.env.mkgEndpoint");
    return process.env.mkgEndpoint;
  }

  static getResolvedMkgEndpoint(enquiryNumber, options) {
    let masterKeyEndpointWithParams = this.mkgEndpoint.replace(
      "%enquiry_number%",
      enquiryNumber
    );
    if ("deviceType" in options) {
      return masterKeyEndpointWithParams.replace(
        "%device_type%",
        options.deviceType
      );
    }
    if ("serialNumber" in options) {
      return masterKeyEndpointWithParams.replace(
        "%serial_number%",
        options.serialNumber
      );
    }
    throw new Error(
      "Invalid request data: serialNumber or deviceType not found in options",
      options
    );
  }

  static async getMasterKey(enquiryNumber, options) {
    console.log("Preparing master key request...");
    const [clientId, xApiKey] = await getSherpaAuthParameters();
    console.log({ clientId, xApiKey });
    const masterKeyEndpointWithParams = this.getResolvedMkgEndpoint(
      enquiryNumber,
      options
    );
    console.log(
      `Master key request ready, fetching via GET form ${masterKeyEndpointWithParams}`
    );

    const proxyAgent = process.env.https_proxy
      ? createHttpsProxyAgent(process.env.https_proxy)
      : null;

    const headers = {
      client_id: clientId,
      "x-api-key": xApiKey,
    };

    if (false) {
      const { data: responseData } = await axios.get(
        masterKeyEndpointWithParams,
        {
          headers,
          httpsAgent: proxyAgent as unknown as RequestInit,
          // proxy: {
          //   host: 'proxyffm3.nintendo.de',
          //   port: 8080,
          // },
        }
      );
    }

    const response = await fetch(masterKeyEndpointWithParams, {
      // @ts-ignore
      agent: proxyAgent,
      headers,
    });
    if (!response.ok) {
      let errorJson = await response.json();
      throw new ErrorWithDetails(errorJson?.message, errorJson);
    }
    const responseData = await response.json();

    let isLocalInvoke = false;
    if (isLocalInvoke && "request_status" in responseData) {
      console.info("Returning fake success for development environment");
      return "FakeDevMasterKey";
    }
    console.log(`Response from Sherpa MKG: ${JSON.stringify(responseData)}`);
    // ResponseUtils.checkMkgResponse(responseData);
    console.log("Master Key generated successfully!");
    return responseData.Items[0].masterkey;
  }

  static getLegacyDeviceCode(system) {
    switch (system) {
      case "CTR": // 3DS
      case "SPR": // 3DS XL
      case "KTR": // New 3DS
      case "RED": // New 3DS XL
      case "FTR": // 2DS
      case "JAN": // New 2DS XL
        // All these are CTR in the sherpa MKG
        return "CTR";
      case "RVL": // WII
        return "WII";
      case "TWL": // DSi
      case "UTL": //DSi XL
        return "DSi";
      default:
        return system;
    }
  }
}
