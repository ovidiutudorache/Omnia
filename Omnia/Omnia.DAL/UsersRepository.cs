using RS.Common;
using RS.Data;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data.Entity.Core.Objects;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Omnia.DAL
{
    public class UsersRepository : RepositoryBase<OmniaEntities>
    {
        public DM.AuthenticatedUser SaveUser(DM.OAuthProviders provider, string externalId, string email, string firstName, string lastName, string pictureUri, string accessToken, string externalAccessToken, out int userOAuthProviderId)
        {
            Users user = null;

            if (!string.IsNullOrWhiteSpace(email))
                user = DataContext.Users.Include("UserOAuthProviders").FirstOrDefault(el => el.Email.Equals(email, StringComparison.InvariantCultureIgnoreCase));
            else user = DataContext.UserOAuthProviders.Include("UserOAuthProviders").Where(el => el.OAuthProviderId == (int)provider && el.ExternalId == externalId).Select(el => el.Users).FirstOrDefault();
            if (user == null)
            {
                user = new Users()
                {
                    DateAdded = DateTime.Now,
                    Email = email,
                    PublicId = Guid.NewGuid()
                };

                DataContext.Users.Add(user);
            }

            UserOAuthProviders userProvider = user.UserOAuthProviders.FirstOrDefault(el => el.OAuthProviderId == (int)provider && el.ExternalId == externalId);
            if (userProvider == null)
            {
                userProvider = new UserOAuthProviders()
                {
                    DateAdded = DateTime.Now,
                    ExternalId = externalId,
                    OAuthProviderId = (int)provider
                };

                user.UserOAuthProviders.Add(userProvider);
            }

            userProvider.FirstName = firstName;
            userProvider.LastName = lastName;
            userProvider.PictureUri = pictureUri;

            DataContext.SaveChanges();

            userOAuthProviderId = userProvider.Id;

            return new DM.AuthenticatedUser()
            {
                Email = email,
                FirstName = firstName,
                Id = user.PublicId.ToString("N"),
                LastName = lastName,
                PictureUri = pictureUri,
                Provider = provider,
                AccessToken = accessToken,
                ProviderAccessToken = externalAccessToken
            };
        }

        public void AddLogin(int applicationOAuthProviderId, int userOAuthProviderId, string accessToken, string externalAccessToken)
        {
            DataContext.UserOAuthProviderLogins.Add(new UserOAuthProviderLogins()
            {
                LoginDate = DateTime.Now,
                ApplicationOAuthProviderId = applicationOAuthProviderId,
                UserOAuthProviderId = userOAuthProviderId,
                AccessToken = accessToken,
                ExternalAccessToken = externalAccessToken
            });

            DataContext.SaveChangesAsync();
        }

        public DM.AuthenticatedUser GetAuthenticatedUser(string accessToken, out int applicationId)
        {
            applicationId = 0;
            DM.AuthenticatedUser user = null;

            try
            {
                if (DataContext.Database.Connection.State != System.Data.ConnectionState.Open)
                    DataContext.Database.Connection.Open();

                using (var command = DataContext.Database.Connection.CreateCommand())
                {
                    command.CommandText = "GetAccessTokenUser";
                    command.CommandType = System.Data.CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@accessToken", accessToken));

                    var applicationIdParameter = new SqlParameter("@applicationId", System.Data.SqlDbType.Int);
                    applicationIdParameter.Direction = System.Data.ParameterDirection.Output;
                    command.Parameters.Add(applicationIdParameter);

                    using (DbDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            user = new DM.AuthenticatedUser();
                            user.AccessToken = accessToken;
                            user.Id = DataConverter.ToString(reader["PublicId"]);
                            user.Email = DataConverter.ToString(reader["Email"]);
                            user.FirstName = DataConverter.ToString(reader["FirstName"]);
                            user.LastName = DataConverter.ToString(reader["LastName"]);
                            user.PictureUri = DataConverter.ToString(reader["PictureUri"]);
                            user.Provider = DataConverter.ToEnum<DM.OAuthProviders>(reader["ProviderId"]);
                            user.ProviderAccessToken = DataConverter.ToString(reader["ExternalAccessToken"]);
                        }
                    }

                    if (user != null)
                        applicationId = DataConverter.ToInt32(applicationIdParameter.Value);
                }

                return user;
            }
            finally
            {
                if (DataContext.Database.Connection.State != System.Data.ConnectionState.Closed)
                    DataContext.Database.Connection.Close();
            }
        }
    }
}