//calm formula: 
//Math.tanh((dex-17)/4)*(3/(Math.PI * 4))+.71;

//reckless formula:  
//let q = (dex-15)/30;
//(q/(Math.sqrt(1+q**2))+2.9)/4;

//serious formula: 
//Math.atan((dex - 13)/6)*(1/(Math.PI * 2))+0.72;

module.exports = {
    calm: [0.47136471458950413, 0.4714277032549477, 0.47153151771966295, 0.4717025802651529, 0.4719843470920816, 0.4724481759555027, 0.47321093297180583, 0.47446318628608825, 0.4765134640495349, 0.47985536803102363, 0.4852631446135428, 0.4939117718021342, 0.5074871983351643, 0.5281827881746102, 0.5583693569418865, 0.599677655201742, 0.6515299763344918, 0.71, 0.7684700236655081, 0.8203223447982579, 0.8616306430581134, 0.8918172118253898, 0.9125128016648356, 0.9260882281978657, 0.9347368553864571, 0.9401446319689764, 0.943486535950465, 0.9455368137139117, 0.9467890670281941, 0.9475518240444972, 0.9480156529079183, 0.948297419734847, 0.948468482280337, 0.9485722967450523, 0.9486352854104958, 0.9486734980676861, 0.9486966781966026, 0.9487107387522135, 0.948719267313786, 0.9487244402963115, 0.9487275779234288, 0.9487294810105655, 0.9487306352986534, 0.948731335412488, 0.9487317600539942, 0.9487320176124552, 0.9487321738296938, 0.9487322685802884, 0.9487323260494473, 0.948732360906261, 0.9487323820479897, 0.9487323948710973, 0.9487324026487054, 0.9487324073660635, 0.9487324102272857, 0.9487324119627047, 0.9487324130152897, 0.9487324136537146, 0.948732414040939, 0.9487324142758023, 0.9487324144182543, 0.9487324145046556, 0.9487324145570608, 0.948732414588846, 0.9487324146081249, 0.948732414619818, 0.9487324146269103, 0.9487324146312119, 0.9487324146338211, 0.9487324146354036, 0.9487324146363634, 0.9487324146369456, 0.9487324146372986, 0.9487324146375128, 0.9487324146376428, 0.9487324146377215, 0.9487324146377694, 0.9487324146377982, 0.9487324146378159, 0.9487324146378265, 0.948732414637833, 0.9487324146378369, 0.9487324146378393, 0.9487324146378407, 0.9487324146378416, 0.9487324146378422, 0.9487324146378424, 0.9487324146378426, 0.9487324146378427, 0.9487324146378429, 0.9487324146378429, 0.9487324146378429, 0.948732414637843, 0.948732414637843, 0.948732414637843, 0.948732414637843, 0.948732414637843, 0.948732414637843, 0.948732414637843, 0.948732414637843],
    reckless: [0.6131966011250105, 0.619278633667219, 0.6255981405914248, 0.632152330911474, 0.6389363377103942, 0.6459430584957905, 0.6531630286084136, 0.660584337359917, 0.6681925960983954, 0.6759709662154539, 0.6839002531736607, 0.6919590699772455, 0.7001240702447502, 0.7083702473690565, 0.7166712924418404, 0.725, 0.7333287075581596, 0.7416297526309434, 0.7498759297552497, 0.7580409300227544, 0.7660997468263393, 0.774029033784546, 0.7818074039016045, 0.789415662640083, 0.7968369713915864, 0.8040569415042095, 0.8110636622896058, 0.8178476690885259, 0.8244018594085751, 0.8307213663327809, 0.8368033988749894, 0.8426470588235294, 0.84825314299522, 0.8536239388568816, 0.8587630202960861, 0.8636750490563072, 0.868365586090832, 0.8728409159068793, 0.8771078859142839, 0.8811737618886061, 0.8850460999161199, 0.8887326346044604, 0.8922411829056124, 0.8955795625900027, 0.8987555242118688, 0.9017766952966368, 0.9046505354416476, 0.9073843010350213, 0.9099850183489859, 0.9124594638412731, 0.9148141505913241, 0.917055319899344, 0.9191889371798759, 0.9212206913833565, 0.92315599727615, 0.9249999999999999, 0.9267575814146075, 0.9284333678016837, 0.9300317385752958, 0.9315568357018869, 0.9330125735844609, 0.9344026492096535, 0.9357305523943971, 0.9369995760012719, 0.9382128260190663, 0.939373231428136, 0.9404835537894424, 0.94154639651215, 0.9425642137678649, 0.9435393190303845, 0.9444738932285961, 0.9453699925071954, 0.9462295555954956, 0.9470544107889872, 0.9478462825517009, 0.9486067977499789, 0.9493374915301445, 0.9500398128538784, 0.9507151297059826, 0.9513647339897171, 0.9519898461251128, 0.9525916193656512, 0.9531711438485077, 0.953729450393233, 0.9542675140633088, 0.9547862575045144, 0.955286554073483, 0.9557692307692307, 0.9562350709798397, 0.9566848170558512, 0.9571191727213149, 0.9575388053328306, 0.9579443479963301, 0.9583364015507648, 0.9587155364273234, 0.9590822943922611, 0.9594371901809259, 0.9597807130300803, 0.9601133281151637, 0.9604354778987093],
    serious: [0.538819834913422, 0.5437918088252166, 0.5494734990721255, 0.5560104348113153, 0.5635835209054993, 0.5724163823495667, 0.5827813740139013, 0.595, 0.6094289691881523, 0.6264164790945006, 0.6462081911747833, 0.6687918088252166, 0.6937157716443733, 0.72, 0.7462842283556267, 0.7712081911747833, 0.7937918088252166, 0.8135835209054993, 0.8305710308118477, 0.845, 0.8572186259860987, 0.8675836176504332, 0.8764164790945006, 0.8839895651886847, 0.8905265009278744, 0.8962081911747833, 0.901180165086578, 0.9055594707954217, 0.9094405292045783, 0.9128998743900459, 0.9159999032550661, 0.9187918088252166, 0.9213178656285476, 0.9236132104611288, 0.9257072336085477, 0.927624670269284, 0.9293864611426899, 0.9310104348113153, 0.9325118519977894, 0.9339038422446764, 0.935197756363468, 0.9364034525638553, 0.9375295300682245, 0.9385835209054993, 0.9395720482127824, 0.9405009575662358, 0.94137542647565, 0.9422000561071073, 0.9429789484683289, 0.9437157716443733, 0.9444138151643982, 0.9450760371808433, 0.9457051048262355, 0.9463034288612552, 0.9468731935265922, 0.9474163823495667, 0.9479348005261377, 0.948430094393263, 0.9489037684205793, 0.9493572000800764, 0.9497916528947521, 0.9502082879197172, 0.9506081738699173, 0.9509922960760252, 0.9513615644228974, 0.9517168204022833, 0.9520588433924482, 0.9523883562613613, 0.9527060303765951, 0.9530124900936516, 0.9533083167847374, 0.9535940524617486, 0.95387020304019, 0.9541372412847232, 0.95439560947187, 0.9546457218009551, 0.9548879665805402, 0.9551227082142911, 0.9553502890073562, 0.9555710308118477, 0.9557852365278537, 0.9559931914745252, 0.956195164644138, 0.9563914098505896, 0.9565821667825279, 0.956767661970205, 0.9569481096741682, 0.9571237127030482, 0.957294663166942, 0.9574611431722186, 0.9576233254629825, 0.9577813740139013, 0.9579354445786405, 0.958085685197725, 0.958232236669281, 0.9583752329857822, 0.958514801739621, 0.9586510645000698, 0.9587841371639524, 0.9589141302821395]
};