using RS.Common;
using RS.Data;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Omnia.Client.DAL
{
    public class ClientRepositoryBase : RepositoryBase<ClientEntities>
    {
        public int ApplicationId { get; set; }

        private string connectionString = null;
        public string ConnectionString { get { return string.IsNullOrWhiteSpace(connectionString) ? (connectionString = BuildConnectionString()) : connectionString; } }

        private ClientEntities dataContext = null;
        public new ClientEntities DataContext { get { return dataContext ?? (dataContext = new ClientEntities(ConnectionString)); } }

        public ClientRepositoryBase(int applicationId)
        {
            ApplicationId = applicationId;
        }

        private string BuildConnectionString()
        {
            ConnectionData connectionData = new Omnia.DAL.ApplicationsRepository().GetConnectionData(ApplicationId);
            if (connectionData == null)
                throw new HandledException("No connection data found for application " + ApplicationId);

            connectionData.Username = "omnia";
            connectionData.Password = "omnia";

            string templateEFConnectionString = ConfigurationManager.ConnectionStrings["ClientEntities"].ConnectionString;

            return connectionData.GenerateEFConnectionString(templateEFConnectionString);
        }
    }
}
