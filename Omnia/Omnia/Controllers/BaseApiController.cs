using RS.Common;
using RS.Logger;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using RS.Web.Extensions;
using System.Collections.Specialized;
using Omnia.BL;

namespace Omnia.Controllers
{
    public abstract class BaseApiController : ApiController
    {
        private NameValueCollection queryStringParameters = null;

        private string accessTokenId = null;
        public string AccessTokenId
        {
            get
            {
                if (!string.IsNullOrWhiteSpace(accessTokenId))
                    return accessTokenId;

                accessTokenId = GetQueryStringParameter("access_token");

                return accessTokenId;
            }
        }

        internal string GetQueryStringParameter(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return null;

            queryStringParameters = queryStringParameters ?? Request.RequestUri.GetQueryParameters();
            if (queryStringParameters == null)
                return null;

            return queryStringParameters[name];
        }

        public ApplicationManager ApplicationManager { get { return AccessToken != null ? ApplicationsManager.GetApplicationManager(AccessToken.ApplicationPublicId) : null; } }

        public DM.AccessToken AccessToken { get { return AccessTokensManager.Instance.GetAccessToken(AccessTokenId); } }

        internal T SimpleCall<T>(Func<T> action)
        {
            T data = default(T);

            try
            {
                data = action();
            }
            catch (HandledException ex)
            {
                throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.InternalServerError)
                {
                    Content = new StringContent(ex.Message),
                    ReasonPhrase = ex.Code.ToString()
                });
            }
            catch (Exception ex)
            {
                Log.Error(ex);

                throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.InternalServerError));
            }

            return data;
        }
    }
}