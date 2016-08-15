using RS.Logger;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using RS.Web.Extensions;
using System.Collections.Specialized;
using Omnia.BL;

namespace Omnia.Attributes
{
    public sealed class EndpointAuthorize : System.Web.Http.AuthorizeAttribute
    {
        protected override bool IsAuthorized(System.Web.Http.Controllers.HttpActionContext actionContext)
        {
            try
            {
                NameValueCollection parameters = actionContext.Request.RequestUri.GetQueryParameters();
                if (parameters == null)
                    return false;

                string accessToken = parameters["access_token"];
                if (string.IsNullOrWhiteSpace(accessToken))
                    return false;

                if (AccessTokensManager.Instance.GetAccessToken(accessToken) == null)
                    return false;

                return true;
            }
            catch (Exception ex)
            {
                Log.Error(ex);
            }

            return base.IsAuthorized(actionContext);
        }
    }
}