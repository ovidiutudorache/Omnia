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
    public class ApplicationsManager
    {
        public static Dictionary<Guid, ApplicationManager> ApplicationManagers { get; private set; }

        public ApplicationManager GetApplicationManager(Guid publicId)
        {
            DM.Application application = null;

            if (ApplicationManagers == null || !ApplicationManagers.ContainsKey(publicId))
            {
                Dictionary<Guid, DM.Application> applications = CacheAccessor.Applications;
                if (applications == null || !applications.ContainsKey(publicId))
                {
                    application = new DAL.ApplicationsRepository().GetApplication(publicId);

                    if (CacheAccessor.Applications == null)
                        CacheAccessor.Applications = new Dictionary<Guid, DM.Application>();
                    if (!CacheAccessor.Applications.ContainsKey(publicId))
                        CacheAccessor.Applications.Add(publicId, application);
                }
                else application = applications[publicId];

                if (application == null)
                    throw new HandledException("Client not found.");

                if (ApplicationManagers == null)
                    ApplicationManagers = new Dictionary<Guid, ApplicationManager>();

                if (!ApplicationManagers.ContainsKey(publicId))
                    ApplicationManagers.Add(publicId, new ApplicationManager(application));
            }

            return ApplicationManagers[publicId];
        }
    }
}
