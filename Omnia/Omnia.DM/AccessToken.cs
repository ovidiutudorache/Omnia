using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Omnia.DM
{
    public class AccessToken
    {
        public string Id { get; private set; }
        public string Code { get; private set; }
        public int ApplicationId { get; set; }
        public DM.AuthenticatedUser User { get; set; }

        public AccessToken(int applicationId, DM.AuthenticatedUser user, string id = null)
        {
            Id = string.IsNullOrWhiteSpace(id) ? GenerateId() : id;
            Code = GenerateCode();
            ApplicationId = applicationId;
            User = user;
        }

        public static string GenerateId()
        {
            return Guid.NewGuid().ToString("N") + Guid.NewGuid().ToString("N") + Guid.NewGuid().ToString("N");
        }

        public static string GenerateCode()
        {
            return Guid.NewGuid().ToString("N") + Guid.NewGuid().ToString("N");
        }
    }
}