/**
 * assembles an strategy object that contains all informations
 * @param  {string} strategyId id of strategy from Strategies DB
 * @return {object}            object that contains the complete strategy informations
 */
this.getStrategyObject = function(strategyId) {

	/* get strategy from db */
    var strategy = Strategies.find({ _id: strategyId }).fetch()[0];


    /* get plugin bundles from db and save them in strategy variable */
    var bundles = strategy.pluginBundles;
    for (i = 0; i < bundles.length; i++) {

        bundles[i] = PluginBundles.find({ _id: bundles[i].bundle }).fetch()[0];


        /* get bundle plugins from db */
        var bundlePlugins = bundles[i].bundlePlugins;
        for (var j = 0; j < bundlePlugins.length; j++) {

            var plugin = PlSwings.find({ _id: bundlePlugins[j].plugin }).fetch()[0];

            if (typeof plugin === "undefined") {
                plugin = PlDummys.find({ _id: bundlePlugins[j].plugin }).fetch()[0];
            }

            bundlePlugins[j] = plugin;


            /* get exchanges from db */
            var exchange = bundlePlugins[j].exchange;

            if (typeof exchange !== "undefined") {
                var tempEx = ExKrakens.find({ _id: exchange }).fetch()[0];

                if (typeof tempEx === "undefined") {
                    tempEx = ExTestDatas.find({ _id: exchange }).fetch()[0];
                }
                bundlePlugins[j].exchange = tempEx;
            }
        }
    }
    
    return strategy;
}


/**
 * Calculates the percentage difference between two values
 * @param  {string} checkVal value to be checked
 * @param  {string} baseVal  basic value
 * @return {string}          calculated percentage differnce
 */
this.percentage = function(checkVal, baseVal) {
    return ((checkVal - baseVal) / baseVal) * 100;
}