/**
 * Created by wayne on 16/9/27.
 */
var Models = require('../../lib/core');
var $Position = Models.$Position;


exports.index = async function (ctx, next) {
  ctx.state  = {positions: await $Position.findPosition({})};
  console.log(ctx.state);
  await ctx.render('index', {
  });
};
