using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Omnia.Client
{
    public class Consumer
    {
        public const string BaseUrl = "http://localhost/omnia/";
        public const string BaseApiUrl = "http://localhost/omnia/api/";

        public string ApplicationId { get; private set; }

        private RestClient client = null;

        public Consumer(string applicationId)
        {
            ApplicationId = applicationId;
            client = new RestClient(BaseApiUrl);
        }

        public Uri GenerateExternalLoginUri(string provider, string state = null)
        {
            string url = BaseUrl + "authentication/ExternalLogin?applicationId=" + ApplicationId + "&provider=" + provider;
            if (!string.IsNullOrWhiteSpace(state))
                url += "&state=" + state;

            return new Uri(url);
        }

        public Omnia.DM.AuthenticatedUser GetAccessToken(string code)
        {
            var request = new RestRequest("AccessTokens", Method.GET);
            request.AddQueryParameter("code", code);

            Omnia.DM.AuthenticatedUser user = GetResponse<Omnia.DM.AuthenticatedUser>(request);

            return user;
        }

        public Omnia.DM.AuthenticatedUser GetAuthenticatedUser(string accessToken)
        {
            var request = new RestRequest("Users", Method.GET);
            request.AddQueryParameter("access_token", accessToken);

            Omnia.DM.AuthenticatedUser user = GetResponse<Omnia.DM.AuthenticatedUser>(request);

            return user;
        }

        private T GetResponse<T>(IRestRequest request) where T: new()
        {
            IRestResponse<T> response = client.Get<T>(request);

            if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
                throw new UnauthorizedAccessException();

            if (response.StatusCode != System.Net.HttpStatusCode.OK)
            {
                DM.ConsumerException exception = SimpleJson.DeserializeObject<DM.ConsumerException>(response.Content);
                if (exception != null)
                    throw exception;
            }

            return response.Data;
        }
    }
}
