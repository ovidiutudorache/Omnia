using Omnia.Attributes;
using Omnia.BL;
using RS.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Omnia.Controllers
{
    public class AccessTokensController : BaseApiController
    {
        public DM.AuthenticatedUser Get(string code)
        {
            DM.AccessToken accessToken = AccessTokensManager.Instance.GetAccessTokenByCode(code);
            if (accessToken == null)
                return null;

            return accessToken.User;
        }
    }
}