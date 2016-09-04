using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Omnia.BL
{
    public class AccessTokensManager
    {
        private static AccessTokensManager instance = null;
        public static AccessTokensManager Instance { get { return instance ?? (instance = new AccessTokensManager()); } }

        private Dictionary<string, string> existingAccessTokens = new Dictionary<string, string>();
        private Dictionary<string, string> codes = new Dictionary<string, string>();

        public Dictionary<string, DM.AccessToken> AccessTokens = new Dictionary<string, DM.AccessToken>();

        AccessTokensManager() { }

        public DM.AccessToken GenerateAccessorToken(int applicationId, Guid applicationPublicId, DM.AuthenticatedUser user, string id = null)
        {
            if (user == null)
                throw new ArgumentNullException("user");

            var accessToken = new DM.AccessToken(applicationId, applicationPublicId, user, id);

            RemoveOldAccessToken(applicationId, user);

            string identifier = GetAccessTokenIdentifier(applicationId, user);
            existingAccessTokens.Add(identifier, accessToken.Id);
            AccessTokens.Add(accessToken.Id, accessToken);
            codes.Add(accessToken.Code, accessToken.Id);

            return accessToken;
        }

        public DM.AccessToken GetAccessToken(string accessToken)
        {
            if (string.IsNullOrWhiteSpace(accessToken))
                return null;

            if (!AccessTokens.ContainsKey(accessToken))
            {
                int applicationId = 0;
                Guid applicationPublicId;
                DM.AuthenticatedUser user = new BL.UsersManager().GetAuthenticatedUser(accessToken, out applicationId, out applicationPublicId);
                if (user == null)
                    return null;

                var at = new DM.AccessToken(applicationId, applicationPublicId, user, accessToken);
                AccessTokens.Add(accessToken, at);

                return at;
            }

            return Instance.AccessTokens[accessToken];
        }

        public DM.AccessToken GetAccessTokenByCode(string code)
        {
            if (string.IsNullOrWhiteSpace(code) || !codes.ContainsKey(code))
                return null;

            string accessTokenId = codes[code];
            codes.Remove(code);

            return AccessTokens[accessTokenId];
        }

        public void Clear()
        {
            existingAccessTokens.Clear();
            codes.Clear();
            AccessTokens.Clear();
        }

        private string GetAccessTokenIdentifier(int applicationId, DM.AuthenticatedUser user)
        {
            string identifier = applicationId.ToString() + "_" + user.Id;

            return identifier;
        }

        private void RemoveOldAccessToken(int applicationId, DM.AuthenticatedUser user)
        {
            string identifier = GetAccessTokenIdentifier(applicationId, user);
            string existingAccessToken = existingAccessTokens.ContainsKey(identifier) ? existingAccessTokens[identifier] : null;
            if (!string.IsNullOrWhiteSpace(existingAccessToken))
            {
                AccessTokens.Remove(existingAccessToken);
                existingAccessTokens.Remove(identifier);
            }
        }
    }
}