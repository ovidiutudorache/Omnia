CREATE TABLE [dbo].[ApplicationDatabases] (
    [Id]            INT            IDENTITY (1, 1) NOT NULL,
    [ApplicationId] INT            NOT NULL,
    [SqlInstanceId] INT            NOT NULL,
    [DatabaseName]  NVARCHAR (250) NOT NULL,
    CONSTRAINT [PK_ApplicationDatabases] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_ApplicationDatabases_Applications] FOREIGN KEY ([ApplicationId]) REFERENCES [dbo].[Applications] ([Id]),
    CONSTRAINT [FK_ApplicationDatabases_SqlInstances] FOREIGN KEY ([SqlInstanceId]) REFERENCES [dbo].[SqlInstances] ([Id])
);

