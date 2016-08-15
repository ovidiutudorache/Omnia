using RS.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Omnia.DAL
{
    public class ApplicationsRepository : RepositoryBase<OmniaEntities>
    {
        public DM.Application GetApplication(Guid publicId)
        {
            DM.Application application = DataContext.Applications.Where(el => el.PublicId == publicId).Select(el => new DM.Application()
            {
                Id = el.Id,
                Name = el.Name,
                PublicId = el.PublicId,
                PrivateKey = el.PrivateKey,
                RedirectUrl = el.RedirectUrl,
            }).FirstOrDefault();

            if (application != null)
                application.OAuthProviders = GetClientOAuthProviders(publicId);

            return application;
        }

        public Dictionary<DM.OAuthProviders, DM.ApplicationOAuthProvider> GetClientOAuthProviders(Guid publicId)
        {
            Dictionary<DM.OAuthProviders, DM.ApplicationOAuthProvider> providers = null;

            foreach (var item in DataContext.ApplicationOAuthProviders.Where(el => el.Applications.PublicId == publicId))
            {
                if (providers == null)
                    providers = new Dictionary<DM.OAuthProviders, DM.ApplicationOAuthProvider>();

                providers.Add((DM.OAuthProviders)item.OAuthProviderId, new DM.ApplicationOAuthProvider()
                {
                    ExternalId = item.ExternalId,
                    ExternalSecret = item.ExternalSecret,
                    Scope = item.Scope,
                    Id = item.Id
                });
            }

            return providers;
        }
    }
}