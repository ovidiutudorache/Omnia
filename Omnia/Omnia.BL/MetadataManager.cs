using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Omnia.BL
{
    public class MetadataManager
    {
        public int ApplicationId { get; set; }

        public MetadataManager(int applicationId)
        {
            ApplicationId = applicationId;
        }

        public List<DM.Collection> GetCollections()
        {
            return Client.DAL.RepositoriesFactory.GetMetadataRepository(ApplicationId).GetCollections();
        }
    }
}