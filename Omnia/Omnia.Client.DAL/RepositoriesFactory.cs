using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Omnia.Client.DAL
{
    public static class RepositoriesFactory
    {
        private static Dictionary<int, ApplicationRepositories> applicationsRepositories = null;

        public static MetadataRepository GetMetadataRepository(int applicationId)
        {
            if (applicationsRepositories == null)
                applicationsRepositories = new Dictionary<int, ApplicationRepositories>();
            if (!applicationsRepositories.ContainsKey(applicationId))
                applicationsRepositories.Add(applicationId, new ApplicationRepositories(applicationId));

            return applicationsRepositories[applicationId].MetadataRepository;
        }
    }
}
