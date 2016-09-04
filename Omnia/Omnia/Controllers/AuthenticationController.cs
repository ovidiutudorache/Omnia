using OAuth2.Client;
using Omnia.DM;
using RS.Common;
using System;
using System.Collections.Generic;
using System.Web.Mvc;
using RS.Web.Extensions;

namespace Omnia.Controllers
{
    public class AuthenticationController : BaseController
    {
        public static Dictionary<string, AuthenticationRequest> Requests = new Dictionary<string, AuthenticationRequest>();

        public ActionResult ExternalLogin(Guid applicationId, string provider, string state = null)
        {
            if (string.IsNullOrWhiteSpace(provider))
                throw new HandledException("Provider not specified.");

            OAuthProviders selectedProvider;
            if (!Enum.TryParse<OAuthProviders>(provider, true, out selectedProvider))
                throw new HandledException("Provider {0} is not supported.", provider);

            OAuth2Client oAuthClient = GetOAuth2Client(applicationId, selectedProvider);

            string requestId = AddAuthenticationRequest(applicationId, selectedProvider, state);

            string loginUrl = oAuthClient.GetLoginLinkUri(requestId);

            return Redirect(loginUrl);
        }

        public ActionResult Authenticated()
        {
            string requestId = Request.QueryString["state"];
            if (string.IsNullOrWhiteSpace(requestId) || !Requests.ContainsKey(requestId))
                throw new HandledException("Request {0} not found.", requestId);

            AuthenticationRequest request = Requests[requestId];
            Requests.Remove(requestId);

            if (request == null)
                throw new HandledException("Request found but it is null.");

            OAuth2Client oAuthClient = GetOAuth2Client(request.ApplicationId, request.Provider);

            OAuth2.Models.UserInfo userInfo = null;
            userInfo = oAuthClient.GetUserInfo(Request.QueryString);

            if (userInfo == null)
                throw new HandledException("Unable to get user information from provider.");

            DM.AccessToken accessToken = new BL.UsersManager().AuthenticateUser(request, userInfo.Id, userInfo.Email, userInfo.FirstName, userInfo.LastName, userInfo.PhotoUri, oAuthClient.AccessToken, true);
            if (accessToken == null)
                throw new HandledException("Unable to authenticate user.");

            BL.ApplicationManager applicationManager = BL.ApplicationsManager.GetApplicationManager(request.ApplicationId);

            var url = new Uri(applicationManager.Application.RedirectUrl);
            url = url.AddParameter("code", accessToken.Code);

            if (!string.IsNullOrWhiteSpace(request.State))
                url = url.AddParameter("state", request.State);

            return Redirect(url.ToString());
        }

        private OAuth2Client GetOAuth2Client(Guid applicationId, OAuthProviders provider)
        {
            BL.ApplicationManager applicationManager = BL.ApplicationsManager.GetApplicationManager(applicationId);
            if (applicationManager == null)
                throw new HandledException("Application not found.");

            if (applicationManager.Application.RedirectUrl == null)
                throw new HandledException("Application redirect url is not defined.");

            OAuth2Client oAuthClient = applicationManager.GetOAuthClient(provider);
            if (oAuthClient == null)
                throw new HandledException("Application does not have access to this OAuth provider.");

            return oAuthClient;
        }

        private string AddAuthenticationRequest(Guid applicationId, OAuthProviders provider, string state = null)
        {
            string requestId = Guid.NewGuid().ToString();
            Requests.Add(requestId, new AuthenticationRequest()
            {
                ApplicationId = applicationId,
                Provider = provider,
                State = state
            });

            return requestId;
        }
    }
}