CREATE TABLE [dbo].[OAuthProviders] (
    [Id]   INT           NOT NULL,
    [Name] NVARCHAR (50) NOT NULL,
    CONSTRAINT [PK_OAuthProviders] PRIMARY KEY CLUSTERED ([Id] ASC)
);

