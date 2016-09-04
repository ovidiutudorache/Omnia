CREATE TABLE [dbo].[SqlInstances] (
    [Id]     INT           IDENTITY (1, 1) NOT NULL,
    [Server] NVARCHAR (50) NOT NULL,
    CONSTRAINT [PK_SqlInstances] PRIMARY KEY CLUSTERED ([Id] ASC)
);

