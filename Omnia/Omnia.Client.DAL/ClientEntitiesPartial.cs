using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Validation;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RS.Common.Extensions;

namespace Omnia.Client.DAL
{
    public partial class ClientEntities : DbContext
    {
        public ClientEntities(string connectionString)
            : base(connectionString)
        {
        }

        public override int SaveChanges()
        {
            try
            {
                return base.SaveChanges();
            }
            catch (DbEntityValidationException dbEx)
            {
                var errorBuilder = new StringBuilder();
                foreach (var item in dbEx.EntityValidationErrors)
                    foreach (var error in item.ValidationErrors)
                        errorBuilder.AppendLine(string.Format("{0}: {1}", error.PropertyName, error.ErrorMessage));

                throw new Exception(dbEx.GetAllMessages() + errorBuilder.ToString());
            }
        }
    }
}