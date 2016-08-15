using Omnia.Attributes;
using Omnia.BL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Omnia.Controllers
{
    public class UsersController : BaseApiController
    {
        [EndpointAuthorize]
        public DM.AuthenticatedUser Get()
        {
            return AccessToken.User;
        }
    }
}