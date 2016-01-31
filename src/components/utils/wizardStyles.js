export default function(schema, wizardStyles) {


  //background style
  if (wizardStyles !== undefined && wizardStyles.background !== undefined) {
    schema.props.background = wizardStyles.background;
  }

  //other styles
  if (schema.props.context === undefined) schema.props.context = {};
  var styles = schema.props.context && schema.props.context.styles;
  if (styles === undefined) styles = schema.props.context.styles = {};

  if (wizardStyles !== undefined) {
    //font settings
    var font = wizardStyles.text && wizardStyles.text.font;
    if (font !== undefined) {
      var text = styles["Core.HtmlContent"];
      if (text === undefined) text = styles["Core.HtmlContent"] = {};
      text.font = font;
      text = styles["Core.HtmlBox"];
      if (text === undefined) text = styles["Core.HtmlBox"] ={};
      text.font = font;
      text = styles["Core.SmartImageBox"];
      if (text === undefined) text = styles["Core.SmartImageBox"] ={};
      text.font = font;
    }

    //image settings
    var border = wizardStyles.text && wizardStyles.image.border;
    if (border !== undefined) {
      var image = styles["Core.SmartImageBox"];
      if (image === undefined) image = styles["Core.SmartImageBox"] = {};
      image.border = border;
    }
  }
}
