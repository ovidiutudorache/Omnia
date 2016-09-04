using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Omnia.Client.DAL
{
    internal class ApplicationRepositories
    {
        private int applicationId;

        internal ApplicationRepositories(int applicationId)
        {
            this.applicationId = applicationId;
        }

        private MetadataRepository metadataRepository = null;
        public MetadataRepository MetadataRepository { get { return metadataRepository ?? (metadataRepository = new MetadataRepository(applicationId)); } }
    }
}