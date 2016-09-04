CREATE FUNCTION Omnia.LastIndexOf
(
	@text nvarchar(max),
	@char char
)
RETURNS int
AS
BEGIN
	declare @pos int
	SELECT @pos = LEN(@text) - CHARINDEX(@char, REVERSE(@text)) + 1;

	return case when @pos > len(@text) then -1 else @pos end
END
