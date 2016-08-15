using OAuth2.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Omnia.BL
{
    public class ApplicationManager
    {
        public DM.Application Application { get; private set; }

        public Dictionary<DM.OAuthProviders, OAuth2Client> OAuthProviders { get; private set; }

        private bool loadedOAuthClients = false;

        public ApplicationManager(DM.Application client)
        {
            Application = client;
        }

        public OAuth2Client GetOAuthClient(DM.OAuthProviders provider)
        {
            if (!loadedOAuthClients)
                LoadOAuthClients();

            if (OAuthProviders == null || !OAuthProviders.ContainsKey(provider))
                return null;

            return OAuthProviders[provider];
        }

        private void LoadOAuthClients()
        {
            if (loadedOAuthClients)
                return;

            Dictionary<DM.OAuthProviders, DM.ApplicationOAuthProvider> providers = new DAL.ApplicationsRepository().GetClientOAuthProviders(Application.PublicId);
            if (providers != null)
            {
                foreach (var key in providers.Keys)
                {
                    DM.ApplicationOAuthProvider item = providers[key];

                    var requestFactory = new OAuth2.Infrastructure.RequestFactory();
                    var configuration = new OAuth2.Configuration.RuntimeClientConfiguration()
                    {
                        ClientId = item.ExternalId,
                        ClientSecret = item.ExternalSecret,
                        ClientTypeName = Enum.GetName(typeof(DM.OAuthProviders), key),
                        IsEnabled = true,
                        Scope = item.Scope,
                        RedirectUri = Configuration.Local.App.BaseUrl + "Authentication/Authenticated"
                    };

                    OAuth2Client oAuthClient = null;

                    switch (key)
                    {
                        case DM.OAuthProviders.Facebook:
                            oAuthClient = new OAuth2.Client.Impl.FacebookClient(requestFactory, configuration);
                            break;
                        case DM.OAuthProviders.Instagram:
                            oAuthClient = new OAuth2.Client.Impl.InstagramClient(requestFactory, configuration);
                            break;
                    }

                    if (oAuthClient == null)
                        continue;

                    if (OAuthProviders == null)
                        OAuthProviders = new Dictionary<DM.OAuthProviders, OAuth2Client>();

                    OAuthProviders.Add(key, oAuthClient);
                }
            }

            loadedOAuthClients = true;
        }
    }
}