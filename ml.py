import numpy as np 
import sys
import json
import math
import matplotlib.pyplot as plt



def estimate_coef(x, y): 
	# kitne points hai
	n = np.size(x) 

	# mean of x and y 
	m_x, m_y = np.mean(x), np.mean(y) 

	#  deviation about x 
	SS_xy = np.sum(y*x) - n*m_y*m_x 
	SS_xx = np.sum(x*x) - n*m_x*m_x 

	# regression coefficients 
	b_1 = SS_xy / SS_xx
	b_0 = m_y - b_1*m_x

	return(b_0, b_1) 

def plot_regression_line(x, y, b): 
	# plotting the actual points
	plt.scatter(x, y, color = "m", 
			marker = "x", s = 30) 

	# predicted 
	y_pred = b[0] + b[1]*x 

	# regression line 
	plt.plot(x, y_pred, color = "g") 

	# labels 
	plt.xlabel('Dates') 
	plt.ylabel('locations') 

	#  show plot 
	plt.show()
	plt.savefig('plot');

def main():
	# observations 
	# x = np.array([2,1,2,3,2,2,4,2,1,2])
	# y = np.array([1,2,3,4,5,6,7,8,9,10])

	x = np.array(json.loads(sys.argv[2]))
	y = np.array(json.loads(sys.argv[1]))

	# estimating coefficients 
	b = estimate_coef(y, x) 
	#workitout print("Estimated coefficients:\nb_0 = {}".format(b[0]))
	#workitout print("Estimated coeeficients:\nb_1 = {}".format( b[1])) 
	ans = b[1]*11 + b[0]
	print(json.dumps(math.floor(ans)))
	sys.stdout.flush()
	# plotting regression line 
	#workitout plot_regression_line(y, x, b) 
# print("Predicted place")
# P =[.2,.6,.1,.1]
# for i in range(len(P)):
#     print(P[i])




if __name__ == "__main__": 
	main()



