using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Omnia.DM
{
    public class AuthenticatedUser
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PictureUri { get; set; }
        public OAuthProviders Provider { get; set; }
        public string AccessToken { get; set; }
        public string ProviderAccessToken { get; set; }
    }
}