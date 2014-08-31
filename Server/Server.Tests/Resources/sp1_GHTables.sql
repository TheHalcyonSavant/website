CREATE PROCEDURE [dbo].[DropCreateGHTables] 
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	IF OBJECT_ID('dbo.MapSP', 'U') IS NOT NULL DROP TABLE dbo.MapSP
	IF OBJECT_ID('dbo.GHProject', 'U') IS NOT NULL DROP TABLE dbo.GHProject
	IF OBJECT_ID('dbo.GHSkill', 'U') IS NOT NULL DROP TABLE dbo.GHSkill

	CREATE TABLE [dbo].[GHProject](
		[Id] [int] NOT NULL,
		[Name] [nvarchar](max) NULL,
		[Description] [nvarchar](max) NULL,
		CONSTRAINT [PK_dbo.GHProject] PRIMARY KEY CLUSTERED ([Id] ASC) ON [PRIMARY]
	) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

	CREATE TABLE [dbo].[GHSkill](
		[Id] [int] IDENTITY(1,1) NOT NULL,
		[Name] [nvarchar](max) NULL,
		[ParentSkillId] [int] NULL,
		CONSTRAINT [PK_dbo.GHSkill] PRIMARY KEY CLUSTERED ([Id] ASC) ON [PRIMARY]
	) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

	ALTER TABLE [dbo].[GHSkill] WITH CHECK ADD
		CONSTRAINT [FK_dbo.GHSkill_dbo.GHSkill_ParentSkillId] FOREIGN KEY([ParentSkillId])
		REFERENCES [dbo].[GHSkill] ([Id])

	ALTER TABLE [dbo].[GHSkill] CHECK CONSTRAINT [FK_dbo.GHSkill_dbo.GHSkill_ParentSkillId]

	CREATE TABLE [dbo].[MapSP](
		[Id] [int] IDENTITY(1,1) NOT NULL,
		[GHSkillId] [int] NOT NULL,
		[GHProjectId] [int] NOT NULL,
		CONSTRAINT [PK_dbo.MapSP] PRIMARY KEY CLUSTERED ([Id] ASC) ON [PRIMARY]
	) ON [PRIMARY]

	ALTER TABLE [dbo].[MapSP] WITH CHECK ADD
		CONSTRAINT [FK_dbo.MapSP_dbo.GHProject_GHProjectId] FOREIGN KEY([GHProjectId])
		REFERENCES [dbo].[GHProject] ([Id])
		ON DELETE CASCADE

	ALTER TABLE [dbo].[MapSP] CHECK CONSTRAINT [FK_dbo.MapSP_dbo.GHProject_GHProjectId]

	ALTER TABLE [dbo].[MapSP] WITH CHECK ADD
		CONSTRAINT [FK_dbo.MapSP_dbo.GHSkill_GHSkillId] FOREIGN KEY([GHSkillId])
		REFERENCES [dbo].[GHSkill] ([Id])
		ON DELETE CASCADE

	ALTER TABLE [dbo].[MapSP] CHECK CONSTRAINT [FK_dbo.MapSP_dbo.GHSkill_GHSkillId]
END