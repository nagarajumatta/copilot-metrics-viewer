//Make a call to the GitHub API to get Copilot Metrics, the API is https://api.github.com/orgs/toussaintt/copilot/usage
//Add the header Accept: application/vnd.github+json to the request
//Add also the Authorization: Bearer <token> header where <token> is hardcoded for now
//Also add X-GitHub-Api-Version: 2022-11-28 header
//Return the response from the API

import axios from "axios";

import { Metrics } from "../model/MetricsData";
import data from '../assets/copilot_metrics_response_sample.json';

export const getGitHubCopilotMetricsApi = async (): Promise<Metrics[]> => {
  
  let response;
  let metricsData;
  interface EnvVariables {
    gh_token: string;
    gh_orgName: string;
    mocked_data: boolean;
  }

  const envVariables: EnvVariables = {
    gh_token: process.env.VUE_APP_GITHUB_TOKEN || '',
    gh_orgName: process.env.VUE_APP_GITHUB_ORG || '',
    mocked_data: process.env.VUE_APP_MOCKED_DATA === "true",
  };

  if (process.env.VUE_APP_MOCKED_DATA === "true") {
    response = data;
    metricsData = response.map((item: any) => new Metrics(item));
  } else {
    response = await axios.get(
      `https://api.github.com/orgs/${envVariables.gh_orgName}/copilot/usage`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${envVariables.gh_token}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    metricsData = response.data.map((item: any) => new Metrics(item));
  }
  return metricsData;
};