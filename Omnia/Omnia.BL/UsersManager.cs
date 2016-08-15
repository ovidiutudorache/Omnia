using Omnia.Common;
using RS.Caching;
using RS.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Omnia.BL
{
    public class UsersManager
    {
        public DM.AccessToken AuthenticateUser(DM.AuthenticationRequest request, string externalId, string email, string firstName, string lastName, string pictureUri, string externalAccessToken, bool addLogin = false)
        {
            var usersRepository = new DAL.UsersRepository();

            string accessTokenId = DM.AccessToken.GenerateId();
            int userOAuthProviderId = 0;
            DM.AuthenticatedUser user = usersRepository.SaveUser(request.Provider, externalId, email, firstName, lastName, pictureUri, accessTokenId, externalAccessToken, out userOAuthProviderId);

            BL.ApplicationManager applicationManager = new BL.ApplicationsManager().GetApplicationManager(request.ApplicationId);

            DM.AccessToken accessToken = AccessTokensManager.Instance.GenerateAccessorToken(applicationManager.Application.Id, user, accessTokenId);

            if (addLogin)
                usersRepository.AddLogin(applicationManager.Application.OAuthProviders[request.Provider].Id, userOAuthProviderId, accessTokenId, externalAccessToken);

            return accessToken;
        }

        public DM.AuthenticatedUser GetAuthenticatedUser(string accessToken, out int applicationId)
        {
            applicationId = 0;

            return new DAL.UsersRepository().GetAuthenticatedUser(accessToken, out applicationId);
        }
    }
}