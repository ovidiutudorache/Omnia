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
        private static Dictionary<int, Guid> applicationIds = null;

        public static ApplicationManager GetApplicationManager(int id)
        {
            if (applicationIds == null)
                applicationIds = new Dictionary<int, Guid>();

            Guid publicId;

            if (!applicationIds.ContainsKey(id))
            {
                publicId = new DAL.ApplicationsRepository().GetApplicationPublicId(id);
                if (publicId == default(Guid))
                    throw new HandledException("No application found with id " + id);

                applicationIds.Add(id, publicId);
            }

            publicId = applicationIds[id];

            return GetApplicationManager(publicId);
        }

        public static ApplicationManager GetApplicationManager(Guid publicId)
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
